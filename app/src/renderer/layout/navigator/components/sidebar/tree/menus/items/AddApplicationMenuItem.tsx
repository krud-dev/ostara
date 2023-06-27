import { useCallback, useMemo } from 'react';
import { FormattedMessage } from 'react-intl';
import { NodeApi } from 'react-arborist';
import { TreeItem } from 'renderer/layout/navigator/components/sidebar/tree/tree';
import { getItemTypeIcon, isFolder, isItemUpdatable } from 'renderer/utils/itemUtils';
import NiceModal from '@ebay/nice-modal-react';
import { getNewItemSort } from 'renderer/utils/treeUtils';
import CreateApplicationDialog, {
  CreateApplicationDialogProps,
} from 'renderer/components/item/dialogs/create/CreateApplicationDialog';
import CustomMenuItem from 'renderer/components/menu/item/CustomMenuItem';
import { MUIconType } from 'renderer/components/common/IconViewer';
import { ItemRO } from 'renderer/definitions/daemon';
import { ApplicationRO } from 'common/generated_definitions';

type AddApplicationMenuItemProps = {
  node: NodeApi<TreeItem>;
  onClose?: () => void;
  onCreated?: (items: ItemRO[]) => void;
};

export default function AddApplicationMenuItem({ node, onClose, onCreated }: AddApplicationMenuItemProps) {
  const disabled = useMemo<boolean>(() => !isItemUpdatable(node.data), [node.data]);

  const createApplicationHandler = useCallback(async (): Promise<void> => {
    onClose?.();

    if (!isFolder(node.data)) {
      return;
    }

    await NiceModal.show<ApplicationRO | undefined, CreateApplicationDialogProps>(CreateApplicationDialog, {
      parentFolderId: node.data.id,
      sort: getNewItemSort(node.data),
      onCreated: onCreated,
    });
  }, [onClose, node, onCreated]);

  const applicationIcon = useMemo<MUIconType>(() => getItemTypeIcon('application'), []);

  return (
    <CustomMenuItem
      icon={applicationIcon}
      text={<FormattedMessage id={'addApplication'} />}
      onClick={createApplicationHandler}
      disabled={disabled}
    />
  );
}
