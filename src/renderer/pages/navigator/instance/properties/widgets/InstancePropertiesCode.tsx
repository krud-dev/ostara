import React, { useMemo } from 'react';
import yaml from 'js-yaml';
import CodeEditor from 'renderer/components/code/CodeEditor';
import { Extension } from '@codemirror/state';
import { foldService } from '@codemirror/language';
import { search } from '@codemirror/search';
import { Box } from '@mui/material';
import PerfectScrollbar from 'react-perfect-scrollbar';
import useElementDocumentHeight from 'renderer/hooks/useElementDocumentHeight';

type InstancePropertiesCodeProps = {
  properties: { [key: string]: unknown };
};

export default function InstancePropertiesCode({ properties }: InstancePropertiesCodeProps) {
  const code = useMemo<string>(() => yaml.dump(properties, { lineWidth: 1024 }), [properties]);

  const foldingExtension = useMemo<Extension>(
    () =>
      foldService.of((state, lineStartChar, lineEndChar): { from: number; to: number } | null => {
        const lineIndent = (lineText: string): number => {
          return lineText.search(/\S/);
        };

        const linesCount = state.doc.lines;
        const lineToCheck = state.doc.lineAt(lineStartChar);
        const lineToCheckIndent = lineIndent(lineToCheck.text);

        let lastLineInFold = null;
        for (let i = lineToCheck.number + 1; i <= linesCount; i += 1) {
          const line = state.doc.line(i);
          const indent = lineIndent(line.text);
          if (indent > lineToCheckIndent) {
            lastLineInFold = line;
          } else {
            break;
          }
        }

        if (lastLineInFold) {
          return {
            from: lineEndChar,
            to: lastLineInFold.to,
          };
        }

        return null;
      }),
    []
  );

  const searchExtension = useMemo<Extension>(() => search({ top: false }), []);

  const { elementHeight, elementRef } = useElementDocumentHeight();

  return (
    <Box ref={elementRef} sx={{ height: elementHeight }}>
      <PerfectScrollbar options={{ wheelPropagation: true }}>
        <CodeEditor language={'yaml'} value={code} readOnly extensions={[foldingExtension, searchExtension]} />
      </PerfectScrollbar>
    </Box>
  );
}
