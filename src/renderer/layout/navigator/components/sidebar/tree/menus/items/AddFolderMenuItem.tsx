import { useCallback, useMemo } from 'react';
import { FormattedMessage } from 'react-intl';
import { NodeApi } from 'react-arborist';
import { TreeItem } from 'renderer/layout/navigator/components/sidebar/tree/tree';
import { Folder, isFolder, Item } from 'infra/configuration/model/configuration';
import { getItemTypeIcon } from 'renderer/utils/itemUtils';
import NiceModal from '@ebay/nice-modal-react';
import CreateFolderDialog from 'renderer/components/item/dialogs/create/CreateFolderDialog';
import { getNewItemOrder } from 'renderer/utils/treeUtils';
import CustomMenuItem from 'renderer/components/menu/item/CustomMenuItem';
import { MUIconType } from 'renderer/components/icon/IconViewer';

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

  const folderIcon = useMemo<MUIconType>(() => getItemTypeIcon('folder'), []);

  return (
    <CustomMenuItem icon={folderIcon} text={<FormattedMessage id={'addFolder'} />} onClick={createFolderHandler} />
  );
}
