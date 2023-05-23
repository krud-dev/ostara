import { useMemo } from 'react';
import { ItemRO } from '../definitions/daemon';
import { getItemDisplayName } from '../utils/itemUtils';

const useItemDisplayName = (item: ItemRO): string => {
  return useMemo<string>(() => getItemDisplayName(item), [item]);
};
export default useItemDisplayName;
