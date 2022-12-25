import { useCallback } from 'react';
import { ListItemIcon, ListItemText, MenuItem } from '@mui/material';
import { DeleteOutlined } from '@mui/icons-material';
import { FormattedMessage } from 'react-intl';
import { useDeleteItem } from 'renderer/apis/configuration/item/deleteItem';
import { showDeleteConfirmationDialog } from 'renderer/utils/dialogUtils';
import { Item } from 'infra/configuration/model/configuration';

type DeleteMenuItemProps = {
  item: Item;
  onClose?: () => void;
};

export default function DeleteMenuItem({ item, onClose }: DeleteMenuItemProps) {
  const deleteState = useDeleteItem();

  const deleteHandler = useCallback(async (): Promise<void> => {
    onClose?.();

    const confirm = await showDeleteConfirmationDialog(item);
    if (!confirm) {
      return;
    }

    try {
      await deleteState.mutateAsync({ item: item });
    } catch (e) {}
  }, [onClose, item]);

  return (
    <MenuItem onClick={deleteHandler} sx={{ color: 'error.main' }}>
      <ListItemIcon>
        <DeleteOutlined fontSize="small" />
      </ListItemIcon>
      <ListItemText>
        <FormattedMessage id={'delete'} />
      </ListItemText>
    </MenuItem>
  );
}
