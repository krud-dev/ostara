import * as React from 'react';
import { useMemo } from 'react';
import ReactCodeMirror, { ReactCodeMirrorProps } from '@uiw/react-codemirror';
import { EditorView } from '@codemirror/view';
import { Extension } from '@codemirror/state';
import { StreamLanguage } from '@codemirror/language';
import { useUi } from 'renderer/contexts/UiContext';
import { yaml } from '@codemirror/legacy-modes/mode/yaml';

export type ProgrammingLanguage = 'yaml';

interface CodeEditorProps extends ReactCodeMirrorProps {
  language: ProgrammingLanguage;
}

export default function CodeEditor({ language, extensions, ...props }: CodeEditorProps) {
  const { darkMode } = useUi();

  const editorTheme = useMemo<'light' | 'dark'>(() => (darkMode ? 'dark' : 'light'), [darkMode]);

  const languageExtensions = useMemo<Extension[]>(() => {
    if (!language) {
      return [];
    }

    switch (language) {
      case 'yaml':
        return [StreamLanguage.define(yaml)];
      default:
        return [];
    }
  }, [language]);

  return (
    <ReactCodeMirror
      theme={editorTheme}
      extensions={[EditorView.lineWrapping, ...languageExtensions, ...(extensions || [])]}
      {...props}
    />
  );
}
