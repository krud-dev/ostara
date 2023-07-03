import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { ThreadLog } from './ThreadProfilingRequestDetailsDialog';
import CodeEditor from '../../../../../components/code/CodeEditor';
import { useThreadLogContext } from '../contexts/ThreadLogContext';
import { EditorView } from '@codemirror/view';
import {
  searchHighlight,
  SearchHighlightQuery,
  setSearchQuery,
} from '../../../../../components/code/extensions/searchHighlightExtension';

type ThreadLogStackTraceProps = {
  threadLog: ThreadLog;
};

export default function ThreadLogStackTrace({ threadLog }: ThreadLogStackTraceProps) {
  const { search } = useThreadLogContext();

  const viewRef = useRef<EditorView>();

  const stackTrace = useMemo<string>(
    () =>
      threadLog.stackTrace
        .map((element) => `${element.className}.${element.methodName}(${element.fileName}:${element.lineNumber})`)
        .join(`\n`),
    [threadLog.stackTrace]
  );

  const setSearchHighlight = useCallback((searchQuery: string): void => {
    const view = viewRef.current;
    if (!view) {
      return;
    }

    const searchEffect = setSearchQuery.of(new SearchHighlightQuery({ search: searchQuery }));
    view.dispatch({ effects: searchEffect });
  }, []);

  useEffect(() => {
    setSearchHighlight(search);
  }, [search]);

  return (
    <CodeEditor
      language={'java'}
      value={stackTrace}
      editable={false}
      extensions={[searchHighlight()]}
      onCreateEditor={(view) => {
        viewRef.current = view;
        setSearchHighlight(search);
      }}
    />
  );
}
