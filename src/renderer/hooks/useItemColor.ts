import { useMemo } from 'react';
import { EnrichedItem } from 'infra/configuration/model/configuration';
import { useTheme } from '@mui/material/styles';

export const DEFAULT_COLOR_VALUE = 'default';

const useItemColor = (item: EnrichedItem): string => {
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
