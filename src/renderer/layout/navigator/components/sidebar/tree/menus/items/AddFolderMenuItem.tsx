import { useCallback, useMemo } from 'react';
import { ListItemIcon, ListItemText, MenuItem } from '@mui/material';
import { SvgIconComponent } from '@mui/icons-material';
import { FormattedMessage } from 'react-intl';
import { NodeApi } from 'react-arborist';
import { TreeItem } from 'renderer/layout/navigator/components/sidebar/tree/tree';
import { Folder, isFolder, Item } from 'infra/configuration/model/configuration';
import { getItemTypeIcon } from 'renderer/utils/itemUtils';
import NiceModal from '@ebay/nice-modal-react';
import CreateFolderDialog from 'renderer/components/item/dialogs/create/CreateFolderDialog';
import { getNewItemOrder } from 'renderer/utils/treeUtils';
import CustomMenuItem from 'renderer/components/menu/item/CustomMenuItem';

type AddFolderMenuItemProps = {
  node: NodeApi<TreeItem>;
  onClose?: () => void;
  onCreated?: (item: Item) => void;
};

export default function AddFolderMenuItem({ node, onClose, onCreated }: AddFolderMenuItemProps) {
  const createFolderHandler = useCallback((): void => {
    onClose?.();

    if (!isFolder(node.data)) {
      return;
    }

    NiceModal.show<Folder | undefined>(CreateFolderDialog, {
      parentFolderId: node.data.id,
      order: getNewItemOrder(node),
      onCreated: onCreated,
    });
  }, [onClose, node, onCreated]);

  const FolderIcon = useMemo<SvgIconComponent>(() => getItemTypeIcon('folder'), []);

  return (
    <CustomMenuItem Icon={FolderIcon} text={<FormattedMessage id={'addFolder'} />} onClick={createFolderHandler} />
  );
}
