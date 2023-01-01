import { useCallback, useMemo } from 'react';
import { FormattedMessage } from 'react-intl';
import { NodeApi } from 'react-arborist';
import { TreeItem } from 'renderer/layout/navigator/components/sidebar/tree/tree';
import NiceModal from '@ebay/nice-modal-react';
import { Instance, isApplication, isFolder, Item } from 'infra/configuration/model/configuration';
import CreateInstanceDialog from 'renderer/components/item/dialogs/create/CreateInstanceDialog';
import { getNewItemOrder } from 'renderer/utils/treeUtils';
import { getItemTypeIcon } from 'renderer/utils/itemUtils';
import CustomMenuItem from 'renderer/components/menu/item/CustomMenuItem';
import { MUIconType } from 'renderer/components/icon/IconViewer';

type AddInstanceMenuItemProps = {
  node: NodeApi<TreeItem>;
  onClose?: () => void;
  onCreated?: (item: Item) => void;
};

export default function AddInstanceMenuItem({ node, onClose, onCreated }: AddInstanceMenuItemProps) {
  const createInstanceHandler = useCallback((): void => {
    onClose?.();

    if (!isApplication(node.data) && !isFolder(node.data)) {
      return;
    }

    const parentApplicationId = isApplication(node.data) ? node.data.id : undefined;
    const parentFolderId = isFolder(node.data) ? node.data.id : undefined;

    NiceModal.show<Instance | undefined>(CreateInstanceDialog, {
      parentApplicationId: parentApplicationId,
      parentFolderId: parentFolderId,
      order: getNewItemOrder(node),
      onCreated: onCreated,
    });
  }, [onClose, node, onCreated]);

  const instanceIcon = useMemo<MUIconType>(() => getItemTypeIcon('instance'), []);

  return (
    <CustomMenuItem
      icon={instanceIcon}
      text={<FormattedMessage id={'addInstance'} />}
      onClick={createInstanceHandler}
    />
  );
}
