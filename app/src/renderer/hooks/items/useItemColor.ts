import { useCallback, useMemo } from 'react';
import { useTheme } from '@mui/material/styles';
import { ItemRO } from 'renderer/definitions/daemon';
import { TreeItem } from 'renderer/layout/navigator/components/sidebar/tree/tree';
import { findTreeItemPath } from 'renderer/utils/treeUtils';
import { chain } from 'lodash';

export const INHERITED_COLOR_VALUE = 'inherited';
export const DEFAULT_COLOR_VALUE = 'default';

const useItemColor = (item: ItemRO, tree?: readonly TreeItem[]): string => {
  const theme = useTheme();

  const getItemEffectiveColor = useCallback((itemToCheck: ItemRO, treeToCheck?: readonly TreeItem[]): string => {
    if (itemToCheck.color !== INHERITED_COLOR_VALUE) {
      return itemToCheck.color;
    }

    if (!treeToCheck) {
      return DEFAULT_COLOR_VALUE;
    }

    const path = findTreeItemPath(treeToCheck, item.id);
    if (!path) {
      return DEFAULT_COLOR_VALUE;
    }

    const lastNonInheritedColorItem = chain(path)
      .findLast((i) => i.color !== INHERITED_COLOR_VALUE)
      .value();
    if (lastNonInheritedColorItem) {
      return lastNonInheritedColorItem.color;
    }

    return DEFAULT_COLOR_VALUE;
  }, []);

  return useMemo<string>(() => {
    const effectiveColor = getItemEffectiveColor(item, tree);
    return effectiveColor && effectiveColor !== DEFAULT_COLOR_VALUE && effectiveColor !== INHERITED_COLOR_VALUE
      ? effectiveColor
      : theme.palette.text.secondary;
  }, [item, tree, theme.palette]);
};
export default useItemColor;
