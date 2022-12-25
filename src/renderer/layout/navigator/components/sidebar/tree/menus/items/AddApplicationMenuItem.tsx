import { useCallback, useMemo } from 'react';
import { ListItemIcon, ListItemText, MenuItem } from '@mui/material';
import { SvgIconComponent } from '@mui/icons-material';
import { FormattedMessage } from 'react-intl';
import { NodeApi } from 'react-arborist';
import { TreeItem } from 'renderer/layout/navigator/components/sidebar/tree/tree';
import { Application, isFolder, Item } from 'infra/configuration/model/configuration';
import { getItemTypeIcon } from 'renderer/utils/itemUtils';
import NiceModal from '@ebay/nice-modal-react';
import { getNewItemOrder } from 'renderer/utils/treeUtils';
import CreateApplicationDialog from 'renderer/components/item/dialogs/create/CreateApplicationDialog';

type AddApplicationMenuItemProps = {
  node: NodeApi<TreeItem>;
  onClose?: () => void;
  onCreated?: (item: Item) => void;
};

export default function AddApplicationMenuItem({ node, onClose, onCreated }: AddApplicationMenuItemProps) {
  const createApplicationHandler = useCallback((): void => {
    onClose?.();

    if (!isFolder(node.data)) {
      return;
    }

    NiceModal.show<Application | undefined>(CreateApplicationDialog, {
      parentFolderId: node.data.id,
      order: getNewItemOrder(node),
      onCreated: onCreated,
    });
  }, [onClose, node, onCreated]);

  const ApplicationIcon = useMemo<SvgIconComponent>(() => getItemTypeIcon('application'), []);

  return (
    <MenuItem onClick={createApplicationHandler}>
      <ListItemIcon>
        <ApplicationIcon fontSize="small" />
      </ListItemIcon>
      <ListItemText>
        <FormattedMessage id={'addApplication'} />
      </ListItemText>
    </MenuItem>
  );
}
