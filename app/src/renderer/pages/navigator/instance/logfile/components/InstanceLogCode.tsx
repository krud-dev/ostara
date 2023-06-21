import React, { useCallback, useMemo, useRef, useState } from 'react';
import CodeEditor from 'renderer/components/code/CodeEditor';
import { Extension } from '@codemirror/state';
import { search } from '@codemirror/search';
import { Box } from '@mui/material';
import PerfectScrollbar from 'react-perfect-scrollbar';
import useElementDocumentHeight from 'renderer/hooks/useElementDocumentHeight';
import { logLanguage } from 'renderer/components/code/extensions/logLanguageExtension';
import useDelayedEffect from 'renderer/hooks/useDelayedEffect';

type InstanceLogCodeProps = {
  log: string;
};

export default function InstanceLogCode({ log }: InstanceLogCodeProps) {
  const searchExtension = useMemo<Extension>(() => search({ top: false }), []);
  const logLanguageExtension = useMemo<Extension>(() => logLanguage(), []);

  const [isScrolledToBottom, setIsScrolledToBottom] = useState(true);

  const scrollContainerRef = useRef<any>(null);

  const smoothScrollInnerToBottom = useCallback((element: HTMLElement): void => {
    if (element) {
      const start = element.scrollTop;
      const end = element.scrollHeight - element.clientHeight - 1;
      if (start >= end) {
        return;
      }

      const duration = 25;
      let startTime: number;

      const scroll = (timestamp: number) => {
        startTime = startTime || timestamp;
        const elapsed = timestamp - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const scrollTop = Math.floor(start + (end - start) * progress);
        element.scrollTop = scrollTop;

        if (elapsed < duration) {
          requestAnimationFrame(scroll);
        }
      };

      requestAnimationFrame(scroll);
    }
  }, []);

  useDelayedEffect(() => {
    if (scrollContainerRef.current && isScrolledToBottom) {
      smoothScrollInnerToBottom(scrollContainerRef.current);
    }
  }, [log]);

  const scrollUpHandler = useCallback(
    (container: HTMLElement): void => {
      const { scrollHeight, scrollTop, clientHeight } = container;
      if (scrollTop + clientHeight < scrollHeight - 1) {
        setIsScrolledToBottom(false);
      }
    },
    [log]
  );

  const scrollDownHandler = useCallback((container: HTMLElement): void => {
    const { scrollHeight, scrollTop, clientHeight } = container;
    if (scrollTop + clientHeight >= scrollHeight - 1) {
      setIsScrolledToBottom(true);
    }
  }, []);

  const { elementHeight, elementRef } = useElementDocumentHeight();

  return (
    <Box ref={elementRef} sx={{ height: elementHeight }}>
      <PerfectScrollbar
        containerRef={(element) => {
          scrollContainerRef.current = element;
        }}
        onScrollUp={scrollUpHandler}
        onScrollDown={scrollDownHandler}
        options={{ wheelPropagation: true }}
      >
        <CodeEditor
          value={log}
          readOnly
          basicSetup={{ lineNumbers: false }}
          extensions={[searchExtension, logLanguageExtension]}
        />
      </PerfectScrollbar>
    </Box>
  );
}
