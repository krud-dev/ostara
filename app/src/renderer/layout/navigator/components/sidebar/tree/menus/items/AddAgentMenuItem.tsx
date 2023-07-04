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
import CreateAgentDialog, { CreateAgentDialogProps } from 'renderer/components/item/dialogs/create/CreateAgentDialog';

type AddAgentMenuItemProps = {
  node: NodeApi<TreeItem>;
  onClose?: () => void;
  onCreated?: (items: ItemRO[]) => void;
};

export default function AddAgentMenuItem({ node, onClose, onCreated }: AddAgentMenuItemProps) {
  const disabled = useMemo<boolean>(() => !isItemUpdatable(node.data), [node.data]);

  const createAgentHandler = useCallback(async (): Promise<void> => {
    onClose?.();

    if (!isFolder(node.data)) {
      return;
    }

    await NiceModal.show<ApplicationRO | undefined, CreateAgentDialogProps>(CreateAgentDialog, {
      parentFolderId: node.data.id,
      sort: getNewItemSort(node.data),
      onCreated: onCreated,
    });
  }, [onClose, node, onCreated]);

  const agentIcon = useMemo<MUIconType>(() => getItemTypeIcon('agent'), []);

  return (
    <CustomMenuItem
      icon={agentIcon}
      text={<FormattedMessage id={'addAgent'} />}
      onClick={createAgentHandler}
      disabled={disabled}
    />
  );
}
