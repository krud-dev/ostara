import { useCallback, useMemo } from 'react';
import { FormattedMessage } from 'react-intl';
import { getItemTypeIcon } from 'renderer/utils/itemUtils';
import NiceModal from '@ebay/nice-modal-react';
import CreateFolderDialog from 'renderer/components/item/dialogs/create/CreateFolderDialog';
import { Application, Folder, Instance } from 'infra/configuration/model/configuration';
import { useNavigatorTree } from 'renderer/contexts/NavigatorTreeContext';
import { chain } from 'lodash';
import CreateApplicationDialog from 'renderer/components/item/dialogs/create/CreateApplicationDialog';
import CreateInstanceDialog from 'renderer/components/item/dialogs/create/CreateInstanceDialog';
import { PopupState } from 'material-ui-popup-state/hooks';
import CustomMenuItem from 'renderer/components/menu/item/CustomMenuItem';
import { MUIconType } from 'renderer/components/icon/IconViewer';

type CreateItemMenuItemsProps = {
  menuState: PopupState;
};

export default function CreateItemMenuItems({ menuState }: CreateItemMenuItemsProps) {
  const { data } = useNavigatorTree();

  const getNewItemOrder = useCallback((): number => {
    return data?.length
      ? chain(data)
          .map<number>((item) => item.order ?? 0)
          .max()
          .value() + 1
      : 1;
  }, [data]);

  const createFolderHandler = useCallback((): void => {
    menuState.close();

    NiceModal.show<Folder | undefined>(CreateFolderDialog, {
      order: getNewItemOrder(),
    });
  }, [menuState, getNewItemOrder]);

  const createApplicationHandler = useCallback((): void => {
    menuState.close();

    NiceModal.show<Application | undefined>(CreateApplicationDialog, {
      order: getNewItemOrder(),
    });
  }, [menuState, getNewItemOrder]);

  const createInstanceHandler = useCallback((): void => {
    menuState.close();

    NiceModal.show<Instance | undefined>(CreateInstanceDialog, {
      order: getNewItemOrder(),
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
