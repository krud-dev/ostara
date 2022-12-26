import { EnrichedItem, Item } from 'infra/configuration/model/configuration';
import { NodeApi } from 'react-arborist';
import { SxProps } from '@mui/system';
import { Theme } from '@mui/material/styles';

export type TreeItem = EnrichedItem & { children?: TreeItem[] };

type TreeItemContextMenuProps = {
  item: EnrichedItem;
  node?: NodeApi<TreeItem>;
  open: boolean;
  anchorEl?: Element | null;
  onClose?: () => void;
  onCreated?: (item: Item) => void;
  sx?: SxProps<Theme>;
};
