import { useMemo } from 'react';
import { useTheme } from '@mui/material/styles';
import { ItemRO } from '../definitions/daemon';
import useItemEffectiveColor from './useItemEffectiveColor';

export const INHERITED_COLOR_VALUE = 'inherited';
export const DEFAULT_COLOR_VALUE = 'default';

const useItemColor = (item: ItemRO): string => {
  const theme = useTheme();

  const effectiveColor = useItemEffectiveColor(item);

  return useMemo<string>(
    () =>
      effectiveColor && effectiveColor !== DEFAULT_COLOR_VALUE && effectiveColor !== INHERITED_COLOR_VALUE
        ? effectiveColor
        : theme.palette.text.secondary,
    [effectiveColor, theme.palette]
  );
};
export default useItemColor;
