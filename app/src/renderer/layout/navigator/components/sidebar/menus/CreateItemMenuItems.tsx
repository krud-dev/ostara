import { useCallback, useMemo } from 'react';
import { FormattedMessage } from 'react-intl';
import { getItemTypeIcon } from 'renderer/utils/itemUtils';
import NiceModal from '@ebay/nice-modal-react';
import CreateFolderDialog, {
  CreateFolderDialogProps,
} from 'renderer/components/item/dialogs/create/CreateFolderDialog';
import CreateApplicationDialog, {
  CreateApplicationDialogProps,
} from 'renderer/components/item/dialogs/create/CreateApplicationDialog';
import CreateInstanceDialog, {
  CreateInstanceDialogProps,
} from 'renderer/components/item/dialogs/create/CreateInstanceDialog';
import { PopupState } from 'material-ui-popup-state/hooks';
import CustomMenuItem from 'renderer/components/menu/item/CustomMenuItem';
import { MUIconType } from 'renderer/components/common/IconViewer';
import { AgentRO, ApplicationRO, FolderRO, InstanceRO } from 'common/generated_definitions';
import { useNavigatorLayoutContext } from 'renderer/contexts/NavigatorLayoutContext';
import CreateAgentDialog, { CreateAgentDialogProps } from 'renderer/components/item/dialogs/create/CreateAgentDialog';

type CreateItemMenuItemsProps = {
  menuState: PopupState;
};

export default function CreateItemMenuItems({ menuState }: CreateItemMenuItemsProps) {
  const { getNewItemOrder } = useNavigatorLayoutContext();

  const createFolderHandler = useCallback(async (): Promise<void> => {
    menuState.close();

    await NiceModal.show<FolderRO | undefined, CreateFolderDialogProps>(CreateFolderDialog, {
      sort: getNewItemOrder(),
    });
  }, [menuState, getNewItemOrder]);

  const createAgentHandler = useCallback(async (): Promise<void> => {
    menuState.close();

    await NiceModal.show<AgentRO | undefined, CreateAgentDialogProps>(CreateAgentDialog, {
      sort: getNewItemOrder(),
    });
  }, [menuState, getNewItemOrder]);

  const createApplicationHandler = useCallback(async (): Promise<void> => {
    menuState.close();

    await NiceModal.show<ApplicationRO | undefined, CreateApplicationDialogProps>(CreateApplicationDialog, {
      sort: getNewItemOrder(),
    });
  }, [menuState, getNewItemOrder]);

  const createInstanceHandler = useCallback(async (): Promise<void> => {
    menuState.close();

    await NiceModal.show<InstanceRO[] | undefined, CreateInstanceDialogProps>(CreateInstanceDialog, {
      sort: getNewItemOrder(),
    });
  }, [menuState, getNewItemOrder]);

  const folderIcon = useMemo<MUIconType>(() => getItemTypeIcon('folder'), []);
  const agentIcon = useMemo<MUIconType>(() => getItemTypeIcon('agent'), []);
  const applicationIcon = useMemo<MUIconType>(() => getItemTypeIcon('application'), []);
  const instanceIcon = useMemo<MUIconType>(() => getItemTypeIcon('instance'), []);

  return (
    <>
      <CustomMenuItem icon={folderIcon} text={<FormattedMessage id={'createFolder'} />} onClick={createFolderHandler} />
      <CustomMenuItem icon={agentIcon} text={<FormattedMessage id={'createAgent'} />} onClick={createAgentHandler} />
      <CustomMenuItem
        icon={applicationIcon}
        text={<FormattedMessage id={'createApplication'} />}
        onClick={createApplicationHandler}
      />
      <CustomMenuItem
        icon={instanceIcon}
        text={<FormattedMessage id={'createInstance'} />}
        onClick={createInstanceHandler}
      />
    </>
  );
}
