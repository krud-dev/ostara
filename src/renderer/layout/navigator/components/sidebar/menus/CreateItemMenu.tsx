import { useCallback, useMemo } from 'react';
import { IconButton } from '@mui/material';
import MenuPopover from 'renderer/components/menu/popup/MenuPopover';
import { AddOutlined } from '@mui/icons-material';
import { FormattedMessage } from 'react-intl';
import { getItemTypeIcon } from 'renderer/utils/itemUtils';
import NiceModal from '@ebay/nice-modal-react';
import CreateFolderDialog from 'renderer/components/item/dialogs/create/CreateFolderDialog';
import { Application, Folder, Instance } from 'infra/configuration/model/configuration';
import { useNavigatorTree } from 'renderer/contexts/NavigatorTreeContext';
import { chain } from 'lodash';
import CreateApplicationDialog from 'renderer/components/item/dialogs/create/CreateApplicationDialog';
import CreateInstanceDialog from 'renderer/components/item/dialogs/create/CreateInstanceDialog';
import { bindMenu, usePopupState } from 'material-ui-popup-state/hooks';
import CustomMenuItem from 'renderer/components/menu/item/CustomMenuItem';
import { MUIconType } from 'renderer/components/icon/IconViewer';

export default function CreateItemMenu() {
  const { data } = useNavigatorTree();

  const menuState = usePopupState({ variant: 'popover' });

  const openHandler = useCallback((): void => {
    if (!data) {
      return;
    }
    menuState.open();
  }, [data, menuState]);

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
      <IconButton size={'small'} ref={menuState.setAnchorEl} onClick={openHandler}>
        <AddOutlined fontSize={'small'} />
      </IconButton>

      <MenuPopover {...bindMenu(menuState)}>
        <CustomMenuItem
          icon={folderIcon}
          text={<FormattedMessage id={'createFolder'} />}
          onClick={createFolderHandler}
        />
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
      </MenuPopover>
    </>
  );
}
