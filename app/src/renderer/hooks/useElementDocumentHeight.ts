import { useCallback, useMemo, useState } from 'react';
import { useTheme } from '@mui/material/styles';
import { useWindowSize } from 'react-use';
import { isNil } from 'lodash';
import { COMPONENTS_SPACING } from 'renderer/constants/ui';
import { calculateElementDocumentOffsetTop } from 'renderer/utils/elementUtils';

const useElementDocumentHeight = (options?: {
  bottomOffset: number;
}): { elementHeight: number; elementRef: (element: HTMLElement | null) => void } => {
  const theme = useTheme();
  const { height } = useWindowSize();

  const [topOffset, setTopOffset] = useState<number | undefined>(undefined);
  const bottomOffset = useMemo<number>(
    () => options?.bottomOffset || parseInt(theme.spacing(COMPONENTS_SPACING), 10),
    [options, theme]
  );

  const elementHeight = useMemo<number>(() => {
    return isNil(topOffset) ? 0 : height - topOffset - bottomOffset;
  }, [height, topOffset]);

  const elementRef = useCallback((element: HTMLElement | null): void => {
    if (element !== null) {
      setTopOffset(calculateElementDocumentOffsetTop(element));
    }
  }, []);

  return {
    elementHeight: elementHeight,
    elementRef: elementRef,
  };
};
export default useElementDocumentHeight;
