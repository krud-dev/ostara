import { useMemo } from 'react';
import { useTheme } from '@mui/material/styles';
import { ItemRO } from '../definitions/daemon';

export const DEFAULT_COLOR_VALUE = 'default';

const useItemColor = (item: ItemRO): string => {
  const theme = useTheme();
  return useMemo<string>(
    () =>
      item.effectiveColor && item.effectiveColor !== DEFAULT_COLOR_VALUE
        ? item.effectiveColor
        : theme.palette.text.secondary,
    [item, theme.palette]
  );
};
export default useItemColor;
