import { EnrichedItem, Item } from 'infra/configuration/model/configuration';
import { NodeApi } from 'react-arborist';
import { ContextMenuPopperProps } from 'renderer/components/menu/popup/ContextMenuPopper';

export type TreeItem = EnrichedItem & { children?: TreeItem[] };

type TreeItemContextMenuProps = ContextMenuPopperProps & {
  item: EnrichedItem;
  node?: NodeApi<TreeItem>;
  onCreated?: (item: Item) => void;
};
