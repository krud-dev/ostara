import { useCallback, useMemo } from 'react';
import { FormattedMessage } from 'react-intl';
import { getItemTypeIcon } from 'renderer/utils/itemUtils';
import NiceModal from '@ebay/nice-modal-react';
import CreateFolderDialog from 'renderer/components/item/dialogs/create/CreateFolderDialog';
import CreateApplicationDialog from 'renderer/components/item/dialogs/create/CreateApplicationDialog';
import CreateInstanceDialog from 'renderer/components/item/dialogs/create/CreateInstanceDialog';
import { PopupState } from 'material-ui-popup-state/hooks';
import CustomMenuItem from 'renderer/components/menu/item/CustomMenuItem';
import { MUIconType } from 'renderer/components/common/IconViewer';
import { ApplicationRO, FolderRO, InstanceRO } from 'common/generated_definitions';
import { useNavigatorLayout } from 'renderer/contexts/NavigatorLayoutContext';

type CreateItemMenuItemsProps = {
  menuState: PopupState;
};

export default function CreateItemMenuItems({ menuState }: CreateItemMenuItemsProps) {
  const { getNewItemOrder } = useNavigatorLayout();

  const createFolderHandler = useCallback(async (): Promise<void> => {
    menuState.close();

    await NiceModal.show<FolderRO | undefined>(CreateFolderDialog, {
      sort: getNewItemOrder(),
    });
  }, [menuState, getNewItemOrder]);

  const createApplicationHandler = useCallback(async (): Promise<void> => {
    menuState.close();

    await NiceModal.show<ApplicationRO | undefined>(CreateApplicationDialog, {
      sort: getNewItemOrder(),
    });
  }, [menuState, getNewItemOrder]);

  const createInstanceHandler = useCallback(async (): Promise<void> => {
    menuState.close();

    await NiceModal.show<InstanceRO[] | undefined>(CreateInstanceDialog, {
      sort: getNewItemOrder(),
    });
  }, [menuState, getNewItemOrder]);

  const folderIcon = useMemo<MUIconType>(() => getItemTypeIcon('folder'), []);
  const applicationIcon = useMemo<MUIconType>(() => getItemTypeIcon('application'), []);
  const instanceIcon = useMemo<MUIconType>(() => getItemTypeIcon('instance'), []);

  return (
    <>
      <CustomMenuItem icon={folderIcon} text={<FormattedMessage id={'createFolder'} />} onClick={createFolderHandler} />
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
