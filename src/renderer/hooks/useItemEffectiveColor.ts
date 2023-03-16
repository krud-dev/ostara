import { useCallback, useMemo } from 'react';
import { ItemRO } from '../definitions/daemon';
import { useNavigatorTree } from '../contexts/NavigatorTreeContext';
import { DEFAULT_COLOR_VALUE, INHERITED_COLOR_VALUE } from './useItemColor';
import { isInstance } from '../utils/itemUtils';

const useItemEffectiveColor = (item: ItemRO): string => {
  const { data, getItem } = useNavigatorTree();

  const getItemEffectiveColor = useCallback(
    (itemToCheck: ItemRO): string => {
      if (itemToCheck.color !== INHERITED_COLOR_VALUE) {
        return itemToCheck.color;
      }
      if (isInstance(itemToCheck)) {
        const parent = getItem(itemToCheck.parentApplicationId);
        if (parent) {
          return getItemEffectiveColor(parent);
        }
      } else {
        const parent = !!itemToCheck.parentFolderId && getItem(itemToCheck.parentFolderId);
        if (parent) {
          return getItemEffectiveColor(parent);
        }
      }
      return DEFAULT_COLOR_VALUE;
    },
    [getItem]
  );

  return useMemo<string>(() => getItemEffectiveColor(item), [item, data]);
};
export default useItemEffectiveColor;
