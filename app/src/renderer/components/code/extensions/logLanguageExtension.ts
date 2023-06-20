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
  Text,
} from '@codemirror/state';
import { RegExpCursor, SearchCursor } from '@codemirror/search';
import { chain } from 'lodash';
import { ERROR, FATAL, INFO, SECONDARY, SUCCESS, WARNING } from 'renderer/theme/config/palette';

type LogLevel = {
  name: string;
  color: 'info' | 'success' | 'warning' | 'error' | 'fatal';
};

type LogLanguageConfig = {
  logLevels?: LogLevel[];
};

const logLanguageConfigFacet: Facet<LogLanguageConfig, Required<LogLanguageConfig>> = Facet.define({
  combine(configs) {
    return combineConfig(configs, {
      logLevels: [
        { name: 'TRACE', color: 'fatal' },
        { name: 'DEBUG', color: 'info' },
        { name: 'INFO', color: 'success' },
        { name: 'WARN', color: 'warning' },
        { name: 'ERROR', color: 'error' },
      ],
    });
  },
});

export function logLanguage(config?: LogLanguageConfig): Extension {
  return config ? [logLanguageConfigFacet.of(config), logLanguageExtensions] : logLanguageExtensions;
}

function stringWordTest(doc: Text, categorizer: (ch: string) => CharCategory) {
  return (from: number, to: number, buf: string, bufPos: number) => {
    if (bufPos > from || bufPos + buf.length < to) {
      bufPos = Math.max(0, from - 2);
      buf = doc.sliceString(bufPos, Math.min(doc.length, to + 2));
    }
    return (
      (categorizer(charBefore(buf, from - bufPos)) !== CharCategory.Word ||
        categorizer(charAfter(buf, from - bufPos)) !== CharCategory.Word) &&
      (categorizer(charAfter(buf, to - bufPos)) !== CharCategory.Word ||
        categorizer(charBefore(buf, to - bufPos)) !== CharCategory.Word)
    );
  };
}

function charBefore(str: string, index: number) {
  return str.slice(findClusterBreak(str, index, false), index);
}
function charAfter(str: string, index: number) {
  return str.slice(index, findClusterBreak(str, index));
}

const searchHighlighter = ViewPlugin.fromClass(
  class {
    decorations: DecorationSet;

    constructor(readonly view: EditorView) {
      const config = view.state.facet(logLanguageConfigFacet);
      this.decorations = this.highlight(config);
    }

    update(update: ViewUpdate) {
      if (update.docChanged || update.selectionSet || update.viewportChanged) {
        const config = update.state.facet(logLanguageConfigFacet);
        this.decorations = this.highlight(config);
      }
    }

    highlightLogLevel(
      logLevel: LogLevel,
      state: EditorState,
      from: number,
      to: number,
      add: (from: number, to: number) => void
    ) {
      const cursor = new SearchCursor(
        state.doc,
        logLevel.name,
        Math.max(0, from - logLevel.name.length),
        Math.min(to + logLevel.name.length, state.doc.length),
        undefined,
        stringWordTest(state.doc, state.charCategorizer(state.selection.main.head))
      );
      while (!cursor.next().done) {
        add(cursor.value.from, cursor.value.to);
      }
    }

    highlightTimestamp(state: EditorState, from: number, to: number, add: (from: number, to: number) => void) {
      const cursor = new RegExpCursor(
        state.doc,
        '\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}\\.\\d{3}\\+\\d{2}:\\d{2}',
        {},
        Math.max(0, from),
        Math.min(to, state.doc.length)
      );
      while (!cursor.next().done) {
        add(cursor.value.from, cursor.value.to);
      }
    }

    highlight(config: LogLanguageConfig) {
      if (!config.logLevels?.length) {
        return Decoration.none;
      }

      const { view } = this;

      const rangeDecorations: { from: number; to: number; decoration: Decoration }[] = [];
      for (let i = 0, ranges = view.visibleRanges, l = ranges.length; i < l; i += 1) {
        let { from, to } = ranges[i];
        while (i < l - 1 && to > ranges[i + 1].from - 2 * 250) to = ranges[++i].to;

        this.highlightTimestamp(view.state, from, to, (from, to) => {
          rangeDecorations.push({
            from,
            to,
            decoration: Decoration.mark({ class: `cm-logLanguage cm-logLanguage-timestamp` }),
          });
        });

        for (const logLevel of config.logLevels) {
          this.highlightLogLevel(logLevel, view.state, from, to, (from, to) => {
            rangeDecorations.push({
              from,
              to,
              decoration: Decoration.mark({ class: `cm-logLanguage cm-logLanguage-${logLevel.color}` }),
            });
          });
        }
      }

      const builder = new RangeSetBuilder<Decoration>();
      chain(rangeDecorations)
        .sortBy('from')
        .forEach(({ from, to, decoration }) => builder.add(from, to, decoration))
        .value();
      return builder.finish();
    }
  },
  {
    decorations: (v) => v.decorations,
  }
);

const baseTheme = EditorView.baseTheme({
  '.cm-logLanguage-timestamp': { color: SECONDARY.main },
  '.cm-logLanguage-info': { color: INFO.main },
  '.cm-logLanguage-success': { color: SUCCESS.main },
  '.cm-logLanguage-warning': { color: WARNING.main },
  '.cm-logLanguage-error': { color: ERROR.main },
  '.cm-logLanguage-fatal': { color: FATAL.main },
});

const logLanguageExtensions = [Prec.lowest(searchHighlighter), baseTheme];
