import { NodeApi } from 'react-arborist';
import { ContextMenuPopperProps } from 'renderer/components/menu/popup/ContextMenuPopper';
import { PopupState } from 'material-ui-popup-state/es/hooks';
import { ItemRO } from '../../../../../definitions/daemon';

export type TreeItem = ItemRO & { children?: TreeItem[] };

type TreeItemProps = {
  item: ItemRO;
  node?: NodeApi<TreeItem>;
  onCreated?: (item: ItemRO) => void;
};

type TreeItemMenuProps = {
  menuState: PopupState;
} & TreeItemProps;

type TreeItemContextMenuProps = ContextMenuPopperProps & TreeItemProps;
