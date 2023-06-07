import { useCallback, useMemo } from 'react';
import { FormattedMessage } from 'react-intl';
import { NodeApi } from 'react-arborist';
import { TreeItem } from 'renderer/layout/navigator/components/sidebar/tree/tree';
import NiceModal from '@ebay/nice-modal-react';
import CreateInstanceDialog from 'renderer/components/item/dialogs/create/CreateInstanceDialog';
import { getNewItemSort } from 'renderer/utils/treeUtils';
import { getItemTypeIcon, isApplication, isFolder, isItemUpdatable } from 'renderer/utils/itemUtils';
import CustomMenuItem from 'renderer/components/menu/item/CustomMenuItem';
import { MUIconType } from 'renderer/components/common/IconViewer';
import { InstanceRO } from 'common/generated_definitions';
import { ItemRO } from 'renderer/definitions/daemon';

type AddInstanceMenuItemProps = {
  node: NodeApi<TreeItem>;
  onClose?: () => void;
  onCreated?: (item: ItemRO) => void;
};

export default function AddInstanceMenuItem({ node, onClose, onCreated }: AddInstanceMenuItemProps) {
  const disabled = useMemo<boolean>(() => !isItemUpdatable(node.data), [node.data]);

  const createInstanceHandler = useCallback(async (): Promise<void> => {
    onClose?.();

    if (!isApplication(node.data) && !isFolder(node.data)) {
      return;
    }

    const parentApplicationId = isApplication(node.data) ? node.data.id : undefined;
    const parentFolderId = isFolder(node.data) ? node.data.id : undefined;

    await NiceModal.show<InstanceRO[] | undefined>(CreateInstanceDialog, {
      parentApplicationId: parentApplicationId,
      parentFolderId: parentFolderId,
      sort: getNewItemSort(node.data),
      onCreated: onCreated,
    });
  }, [onClose, node, onCreated]);

  const instanceIcon = useMemo<MUIconType>(() => getItemTypeIcon('instance'), []);

  return (
    <CustomMenuItem
      icon={instanceIcon}
      text={<FormattedMessage id={'addInstance'} />}
      onClick={createInstanceHandler}
      disabled={disabled}
    />
  );
}
