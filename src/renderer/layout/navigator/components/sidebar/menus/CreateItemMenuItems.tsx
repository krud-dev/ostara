import { useCallback, useMemo } from 'react';
import { FormattedMessage } from 'react-intl';
import { getItemTypeIcon } from 'renderer/utils/itemUtils';
import NiceModal from '@ebay/nice-modal-react';
import CreateFolderDialog from 'renderer/components/item/dialogs/create/CreateFolderDialog';
import { useNavigatorTree } from 'renderer/contexts/NavigatorTreeContext';
import { chain } from 'lodash';
import CreateApplicationDialog from 'renderer/components/item/dialogs/create/CreateApplicationDialog';
import CreateInstanceDialog from 'renderer/components/item/dialogs/create/CreateInstanceDialog';
import { PopupState } from 'material-ui-popup-state/hooks';
import CustomMenuItem from 'renderer/components/menu/item/CustomMenuItem';
import { MUIconType } from 'renderer/components/common/IconViewer';
import { ApplicationRO, FolderRO, InstanceRO } from '../../../../../../common/generated_definitions';

type CreateItemMenuItemsProps = {
  menuState: PopupState;
};

export default function CreateItemMenuItems({ menuState }: CreateItemMenuItemsProps) {
  const { data } = useNavigatorTree();

  const getNewItemOrder = useCallback((): number => {
    return data?.length
      ? chain(data)
          .map<number>((item) => item.sort ?? 0)
          .max()
          .value() + 1
      : 1;
  }, [data]);

  const createFolderHandler = useCallback((): void => {
    menuState.close();

    NiceModal.show<FolderRO | undefined>(CreateFolderDialog, {
      sort: getNewItemOrder(),
    });
  }, [menuState, getNewItemOrder]);

  const createApplicationHandler = useCallback((): void => {
    menuState.close();

    NiceModal.show<ApplicationRO | undefined>(CreateApplicationDialog, {
      sort: getNewItemOrder(),
    });
  }, [menuState, getNewItemOrder]);

  const createInstanceHandler = useCallback((): void => {
    menuState.close();

    NiceModal.show<InstanceRO[] | undefined>(CreateInstanceDialog, {
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
