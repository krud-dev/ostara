import { useCallback } from 'react';
import { ListItemIcon, ListItemText, MenuItem } from '@mui/material';
import { EditOutlined } from '@mui/icons-material';
import { FormattedMessage } from 'react-intl';
import { NodeApi } from 'react-arborist';
import { TreeItem } from 'renderer/layout/navigator/components/sidebar/tree/tree';
import { updateItem } from 'renderer/utils/itemUtils';

type UpdateMenuItemProps = {
  node: NodeApi<TreeItem>;
  onClose?: () => void;
};

export default function UpdateMenuItem({ node, onClose }: UpdateMenuItemProps) {
  const updateHandler = useCallback(async (): Promise<void> => {
    onClose?.();

    await updateItem(node.data);
  }, [node, onClose]);

  return (
    <MenuItem onClick={updateHandler}>
      <ListItemIcon>
        <EditOutlined fontSize="small" />
      </ListItemIcon>
      <ListItemText>
        <FormattedMessage id={'update'} />
      </ListItemText>
    </MenuItem>
  );
}
