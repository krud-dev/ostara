import { useCallback } from 'react';
import { scroller } from 'react-scroll';
import { useTheme } from '@mui/material/styles';
import { NAVBAR_HEIGHT } from 'renderer/constants/ui';
import { highlightElement } from 'renderer/utils/highlightUtils';

export type HighlightAndScrollOptions = {
  containerId?: string;
  offset?: 'navbar' | number;
};

export const useScrollAndHighlightElement = (): ((elementId: string, options?: HighlightAndScrollOptions) => void) => {
  const theme = useTheme();

  return useCallback(
    (elementId: string, options?: HighlightAndScrollOptions): void => {
      scroller.scrollTo(elementId, {
        duration: 800,
        delay: 0,
        smooth: 'easeInOutQuart',
        offset: options?.offset === 'navbar' ? -(NAVBAR_HEIGHT + parseInt(theme.spacing(3), 10)) : options?.offset,
        isDynamic: true,
        containerId: options?.containerId,
      });

      highlightElement(elementId, theme.palette.divider);
    },
    [theme]
  );
};
