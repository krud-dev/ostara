import { EnrichedItem, Item } from 'infra/configuration/model/configuration';
import { NodeApi } from 'react-arborist';
import { ContextMenuPopperProps } from 'renderer/components/menu/popup/ContextMenuPopper';
import { PopupState } from 'material-ui-popup-state/es/hooks';

export type TreeItem = EnrichedItem & { children?: TreeItem[] };

type TreeItemProps = {
  item: EnrichedItem;
  node?: NodeApi<TreeItem>;
  onCreated?: (item: Item) => void;
};

type TreeItemMenuProps = {
  menuState: PopupState;
} & TreeItemProps;

type TreeItemContextMenuProps = ContextMenuPopperProps & TreeItemProps;
