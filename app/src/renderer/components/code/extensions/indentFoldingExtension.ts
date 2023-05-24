import { foldService } from '@codemirror/language';

export const indentFoldingExtension = foldService.of(
  (state, lineStartChar, lineEndChar): { from: number; to: number } | null => {
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
  }
);
