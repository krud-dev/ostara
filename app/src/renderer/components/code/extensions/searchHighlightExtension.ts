/* eslint-disable */

import { Decoration, DecorationSet, EditorView, ViewPlugin, ViewUpdate } from '@codemirror/view';
import {
  CharCategory,
  combineConfig,
  EditorState,
  Extension,
  Facet,
  findClusterBreak,
  Prec,
  RangeSetBuilder,
  StateEffect,
  StateField,
  Text,
} from '@codemirror/state';
import { SearchCursor } from '@codemirror/search';

interface SearchHighlightConfig {
  /// Whether to enable case sensitivity by default when the search
  /// panel is activated (defaults to false).
  caseSensitive?: boolean;

  /// Whether to treat string searches literally by default (defaults to false).
  literal?: boolean;

  /// Controls whether the default query has by-word matching enabled.
  /// Defaults to false.
  wholeWord?: boolean;
}

const searchHighlightConfigFacet: Facet<SearchHighlightConfig, Required<SearchHighlightConfig>> = Facet.define({
  combine(configs) {
    return combineConfig(configs, {
      caseSensitive: false,
      literal: false,
      wholeWord: false,
    });
  },
});

/// Add search state to the editor configuration, and optionally
/// configure the search extension.
export function searchHighlight(config?: SearchHighlightConfig): Extension {
  return config ? [searchHighlightConfigFacet.of(config), searchExtensions] : searchExtensions;
}

/// A search query. Part of the editor's search state.
export class SearchHighlightQuery {
  /// The search string (or regular expression).
  readonly search: string;

  /// Indicates whether the search is case-sensitive.
  readonly caseSensitive: boolean;

  /// By default, string search will replace `\n`, `\r`, and `\t` in
  /// the query with newline, return, and tab characters. When this
  /// is set to true, that behavior is disabled.
  readonly literal: boolean;

  /// Whether this query is non-empty.
  readonly valid: boolean;

  /// When true, matches that contain words are ignored when there are
  /// further word characters around them.
  readonly wholeWord: boolean;

  /// @internal
  readonly unquoted: string;

  /// Create a query object.
  constructor(config: {
    /// The search string.
    search: string;
    /// Controls whether the search should be case-sensitive.
    caseSensitive?: boolean;
    /// By default, string search will replace `\n`, `\r`, and `\t` in
    /// the query with newline, return, and tab characters. When this
    /// is set to true, that behavior is disabled.
    literal?: boolean;
    /// Enable whole-word matching.
    wholeWord?: boolean;
  }) {
    this.search = config.search;
    this.caseSensitive = !!config.caseSensitive;
    this.literal = !!config.literal;
    this.valid = !!this.search;
    this.unquoted = this.unquote(this.search);
    this.wholeWord = !!config.wholeWord;
  }

  /// @internal
  unquote(text: string) {
    return this.literal
      ? text
      : text.replace(/\\([nrt\\])/g, (_, ch) => (ch == 'n' ? '\n' : ch == 'r' ? '\r' : ch == 't' ? '\t' : '\\'));
  }

  /// Compare this query to another query.
  eq(other: SearchHighlightQuery) {
    return (
      this.search === other.search && this.caseSensitive === other.caseSensitive && this.wholeWord === other.wholeWord
    );
  }

  /// @internal
  create(): QueryType {
    return new StringQuery(this);
  }
}

type SearchResult = typeof SearchCursor.prototype.value;

abstract class QueryType<Result extends SearchResult = SearchResult> {
  constructor(readonly spec: SearchHighlightQuery) {}

  abstract highlight(state: EditorState, from: number, to: number, add: (from: number, to: number) => void): void;
}

function stringCursor(spec: SearchHighlightQuery, state: EditorState, from: number, to: number) {
  return new SearchCursor(
    state.doc,
    spec.unquoted,
    from,
    to,
    spec.caseSensitive ? undefined : (x: string) => x.toLowerCase(),
    spec.wholeWord ? stringWordTest(state.doc, state.charCategorizer(state.selection.main.head)) : undefined
  );
}

function stringWordTest(doc: Text, categorizer: (ch: string) => CharCategory) {
  return (from: number, to: number, buf: string, bufPos: number) => {
    if (bufPos > from || bufPos + buf.length < to) {
      bufPos = Math.max(0, from - 2);
      buf = doc.sliceString(bufPos, Math.min(doc.length, to + 2));
    }
    return (
      (categorizer(charBefore(buf, from - bufPos)) != CharCategory.Word ||
        categorizer(charAfter(buf, from - bufPos)) != CharCategory.Word) &&
      (categorizer(charAfter(buf, to - bufPos)) != CharCategory.Word ||
        categorizer(charBefore(buf, to - bufPos)) != CharCategory.Word)
    );
  };
}

class StringQuery extends QueryType<SearchResult> {
  constructor(spec: SearchHighlightQuery) {
    super(spec);
  }

  highlight(state: EditorState, from: number, to: number, add: (from: number, to: number) => void) {
    let cursor = stringCursor(
      this.spec,
      state,
      Math.max(0, from - this.spec.unquoted.length),
      Math.min(to + this.spec.unquoted.length, state.doc.length)
    );
    while (!cursor.next().done) add(cursor.value.from, cursor.value.to);
  }
}

function charBefore(str: string, index: number) {
  return str.slice(findClusterBreak(str, index, false), index);
}
function charAfter(str: string, index: number) {
  return str.slice(index, findClusterBreak(str, index));
}

/// A state effect that updates the current search query.
export const setSearchQuery = StateEffect.define<SearchHighlightQuery>();

const searchState: StateField<SearchState> = StateField.define<SearchState>({
  create(state) {
    return new SearchState(defaultQuery(state).create());
  },
  update(value, tr) {
    for (let effect of tr.effects) {
      if (effect.is(setSearchQuery)) value = new SearchState(effect.value.create());
    }
    return value;
  },
});

/// Get the current search query from an editor state.
export function getSearchQuery(state: EditorState) {
  let curState = state.field(searchState, false);
  return curState ? curState.query.spec : defaultQuery(state);
}

class SearchState {
  constructor(readonly query: QueryType) {}
}

const matchMark = Decoration.mark({ class: 'cm-searchMatch' }),
  selectedMatchMark = Decoration.mark({ class: 'cm-searchMatch cm-searchMatch-selected' });

const searchHighlighter = ViewPlugin.fromClass(
  class {
    decorations: DecorationSet;

    constructor(readonly view: EditorView) {
      this.decorations = this.highlight(view.state.field(searchState));
    }

    update(update: ViewUpdate) {
      let state = update.state.field(searchState);
      if (
        state != update.startState.field(searchState) ||
        update.docChanged ||
        update.selectionSet ||
        update.viewportChanged
      )
        this.decorations = this.highlight(state);
    }

    highlight({ query }: SearchState) {
      if (!query.spec.valid) return Decoration.none;
      let { view } = this;
      let builder = new RangeSetBuilder<Decoration>();
      for (let i = 0, ranges = view.visibleRanges, l = ranges.length; i < l; i++) {
        let { from, to } = ranges[i];
        while (i < l - 1 && to > ranges[i + 1].from - 2 * 250) to = ranges[++i].to;
        query.highlight(view.state, from, to, (from, to) => {
          let selected = view.state.selection.ranges.some((r) => r.from == from && r.to == to);
          builder.add(from, to, selected ? selectedMatchMark : matchMark);
        });
      }
      return builder.finish();
    }
  },
  {
    decorations: (v) => v.decorations,
  }
);

function defaultQuery(state: EditorState, fallback?: SearchHighlightQuery) {
  let sel = state.selection.main;
  let selText = sel.empty || sel.to > sel.from + 100 ? '' : state.sliceDoc(sel.from, sel.to);
  if (fallback && !selText) return fallback;
  let config = state.facet(searchHighlightConfigFacet);
  return new SearchHighlightQuery({
    search: fallback?.literal ?? config.literal ? selText : selText.replace(/\n/g, '\\n'),
    caseSensitive: fallback?.caseSensitive ?? config.caseSensitive,
    literal: fallback?.literal ?? config.literal,
    wholeWord: fallback?.wholeWord ?? config.wholeWord,
  });
}

const baseTheme = EditorView.baseTheme({
  '.cm-panel.cm-search': {
    padding: '2px 6px 4px',
    position: 'relative',
    '& [name=close]': {
      position: 'absolute',
      top: '0',
      right: '4px',
      backgroundColor: 'inherit',
      border: 'none',
      font: 'inherit',
      padding: 0,
      margin: 0,
    },
    '& input, & button, & label': {
      margin: '.2em .6em .2em 0',
    },
    '& input[type=checkbox]': {
      marginRight: '.2em',
    },
    '& label': {
      fontSize: '80%',
      whiteSpace: 'pre',
    },
  },

  '&light .cm-searchMatch': { backgroundColor: '#ffff0054' },
  '&dark .cm-searchMatch': { backgroundColor: '#00ffff8a' },

  '&light .cm-searchMatch-selected': { backgroundColor: '#ff6a0054' },
  '&dark .cm-searchMatch-selected': { backgroundColor: '#ff00ff8a' },
});

const searchExtensions = [searchState, Prec.lowest(searchHighlighter), baseTheme];
