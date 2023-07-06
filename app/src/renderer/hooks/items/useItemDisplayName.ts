import { useMemo } from 'react';
import { ItemRO } from 'renderer/definitions/daemon';
import { getItemDisplayName } from 'renderer/utils/itemUtils';

const useItemDisplayName = (item: ItemRO): string => {
  return useMemo<string>(() => getItemDisplayName(item), [item]);
};
export default useItemDisplayName;
