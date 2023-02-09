import { useMemo } from 'react';
import { MUIconType } from 'renderer/components/common/IconViewer';
import { getItemType, getItemTypeIcon } from 'renderer/utils/itemUtils';
import { ItemRO } from '../definitions/daemon';

const useItemIcon = (item: ItemRO): MUIconType => {
  const typeIcon = useMemo<MUIconType>(() => getItemTypeIcon(getItemType(item)), [item]);
  return useMemo<MUIconType>(() => (item.icon as MUIconType) || typeIcon, [item, typeIcon]);
};
export default useItemIcon;
