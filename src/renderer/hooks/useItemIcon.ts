import { useMemo } from 'react';
import { Item } from 'infra/configuration/model/configuration';
import { MUIconType } from 'renderer/components/icon/IconViewer';
import { getItemTypeIcon } from 'renderer/utils/itemUtils';

const useItemIcon = (item: Item): MUIconType => {
  const typeIcon = useMemo<MUIconType>(() => getItemTypeIcon(item.type), [item]);
  return useMemo<MUIconType>(() => (item.icon as MUIconType) || typeIcon, [item, typeIcon]);
};
export default useItemIcon;
