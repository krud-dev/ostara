import { useCallback } from 'react';
import { ListItemIcon, ListItemText, MenuItem } from '@mui/material';
import { EditOutlined } from '@mui/icons-material';
import { FormattedMessage } from 'react-intl';
import { NodeApi } from 'react-arborist';
import { TreeItem } from 'renderer/layout/navigator/components/sidebar/tree/tree';

type RenameMenuItemProps = {
  node: NodeApi<TreeItem>;
  onClose?: () => void;
};

export default function RenameMenuItem({ node, onClose }: RenameMenuItemProps) {
  const renameHandler = useCallback(async (): Promise<void> => {
    onClose?.();

    await node.edit();
  }, [node, onClose]);

  return (
    <MenuItem onClick={renameHandler}>
      <ListItemIcon>
        <EditOutlined fontSize="small" />
      </ListItemIcon>
      <ListItemText>
        <FormattedMessage id={'rename'} />
      </ListItemText>
    </MenuItem>
  );
}
