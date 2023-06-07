import { useCallback, useMemo } from 'react';
import { FormattedMessage } from 'react-intl';
import { NodeApi } from 'react-arborist';
import { TreeItem } from 'renderer/layout/navigator/components/sidebar/tree/tree';
import { getItemTypeIcon, isFolder, isItemUpdatable } from 'renderer/utils/itemUtils';
import NiceModal from '@ebay/nice-modal-react';
import CreateFolderDialog from 'renderer/components/item/dialogs/create/CreateFolderDialog';
import { getNewItemSort } from 'renderer/utils/treeUtils';
import CustomMenuItem from 'renderer/components/menu/item/CustomMenuItem';
import { MUIconType } from 'renderer/components/common/IconViewer';
import { ItemRO } from 'renderer/definitions/daemon';
import { FolderRO } from 'common/generated_definitions';

type AddFolderMenuItemProps = {
  node: NodeApi<TreeItem>;
  onClose?: () => void;
  onCreated?: (item: ItemRO) => void;
};

export default function AddFolderMenuItem({ node, onClose, onCreated }: AddFolderMenuItemProps) {
  const disabled = useMemo<boolean>(() => !isItemUpdatable(node.data), [node.data]);

  const createFolderHandler = useCallback(async (): Promise<void> => {
    onClose?.();

    if (!isFolder(node.data)) {
      return;
    }

    await NiceModal.show<FolderRO | undefined>(CreateFolderDialog, {
      parentFolderId: node.data.id,
      sort: getNewItemSort(node.data),
      onCreated: onCreated,
    });
  }, [onClose, node, onCreated]);

  const folderIcon = useMemo<MUIconType>(() => getItemTypeIcon('folder'), []);

  return (
    <CustomMenuItem
      icon={folderIcon}
      text={<FormattedMessage id={'addFolder'} />}
      onClick={createFolderHandler}
      disabled={disabled}
    />
  );
}
