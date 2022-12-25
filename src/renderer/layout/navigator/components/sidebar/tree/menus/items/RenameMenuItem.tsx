import { useCallback } from 'react';
import { ListItemIcon, ListItemText, MenuItem } from '@mui/material';
import { TextFieldsOutlined } from '@mui/icons-material';
import { FormattedMessage } from 'react-intl';
import { NodeApi } from 'react-arborist';
import { TreeItem } from 'renderer/layout/navigator/components/sidebar/tree/tree';
import { Item } from 'infra/configuration/model/configuration';
import { updateItem } from 'renderer/utils/itemUtils';

type RenameMenuItemProps = {
  item: Item;
  node?: NodeApi<TreeItem>;
  onClose?: () => void;
};

export default function RenameMenuItem({ item, node, onClose }: RenameMenuItemProps) {
  const renameHandler = useCallback(async (): Promise<void> => {
    onClose?.();

    if (node) {
      await node.edit();
    } else {
      await updateItem(item);
    }
  }, [item, node, onClose]);

  return (
    <MenuItem onClick={renameHandler}>
      <ListItemIcon>
        <TextFieldsOutlined fontSize="small" />
      </ListItemIcon>
      <ListItemText>
        <FormattedMessage id={'rename'} />
      </ListItemText>
    </MenuItem>
  );
}
