import { useCallback } from 'react';
import { ListItemIcon, ListItemText, MenuItem } from '@mui/material';
import { DeleteOutlined } from '@mui/icons-material';
import { FormattedMessage } from 'react-intl';
import { NodeApi } from 'react-arborist';
import { TreeItem } from 'renderer/layout/navigator/components/sidebar/tree/tree';
import { useDeleteItem } from 'renderer/apis/configuration/item/deleteItem';
import { showDeleteConfirmationDialog } from 'renderer/utils/dialogUtils';

type DeleteMenuItemProps = {
  node: NodeApi<TreeItem>;
  onClose?: () => void;
};

export default function DeleteMenuItem({ node, onClose }: DeleteMenuItemProps) {
  const deleteState = useDeleteItem();

  const deleteHandler = useCallback(async (): Promise<void> => {
    onClose?.();

    const confirm = await showDeleteConfirmationDialog(node.data);
    if (!confirm) {
      return;
    }

    try {
      await deleteState.mutateAsync({ item: node.data });
    } catch (e) {}
  }, [onClose, node.data]);

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
