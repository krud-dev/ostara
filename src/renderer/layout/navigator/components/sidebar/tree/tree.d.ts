import { Item } from 'infra/configuration/model/configuration';
import { NodeApi } from 'react-arborist';

export type TreeItem = Item & { children?: TreeItem[] };

type TreeItemContextMenuProps = {
  node: NodeApi<TreeItem>;
  open: boolean;
  anchorEl?: Element | null;
  onClose?: () => void;
  onCreated?: (item: Item) => void;
};
