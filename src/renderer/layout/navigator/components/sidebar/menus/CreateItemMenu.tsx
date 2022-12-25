import { useCallback, useMemo, useRef, useState } from 'react';
import { IconButton, ListItemIcon, ListItemText, MenuItem } from '@mui/material';
import MenuPopover from 'renderer/components/menu/MenuPopover';
import { AddOutlined, SvgIconComponent } from '@mui/icons-material';
import { FormattedMessage } from 'react-intl';
import { getItemTypeIcon } from 'renderer/utils/itemUtils';
import NiceModal from '@ebay/nice-modal-react';
import CreateFolderDialog from 'renderer/layout/navigator/components/sidebar/dialogs/CreateFolderDialog';
import { Application, Folder, Instance } from 'infra/configuration/model/configuration';
import { useNavigatorTree } from 'renderer/contexts/NavigatorTreeContext';
import { chain } from 'lodash';
import CreateApplicationDialog from 'renderer/layout/navigator/components/sidebar/dialogs/CreateApplicationDialog';
import CreateInstanceDialog from 'renderer/layout/navigator/components/sidebar/dialogs/CreateInstanceDialog';

export default function CreateItemMenu() {
  const { data } = useNavigatorTree();

  const anchorRef = useRef<HTMLButtonElement | null>(null);
  const [open, setOpen] = useState<boolean>(false);

  const openHandler = useCallback((): void => {
    if (!data) {
      return;
    }
    setOpen(true);
  }, [data, setOpen]);

  const closeHandler = useCallback((): void => {
    setOpen(false);
  }, [setOpen]);

  const getNewItemOrder = useCallback((): number => {
    return data?.length
      ? chain(data)
          .map<number>((item) => item.order ?? 0)
          .max()
          .value() + 1
      : 1;
  }, [data]);

  const createFolderHandler = useCallback((): void => {
    closeHandler();

    NiceModal.show<Folder | undefined>(CreateFolderDialog, {
      order: getNewItemOrder(),
    });
  }, [closeHandler, getNewItemOrder]);

  const createApplicationHandler = useCallback((): void => {
    closeHandler();

    NiceModal.show<Application | undefined>(CreateApplicationDialog, {
      order: getNewItemOrder(),
    });
  }, [closeHandler, getNewItemOrder]);

  const createInstanceHandler = useCallback((): void => {
    closeHandler();

    NiceModal.show<Instance | undefined>(CreateInstanceDialog, {
      order: getNewItemOrder(),
    });
  }, [closeHandler, getNewItemOrder]);

  const FolderIcon = useMemo<SvgIconComponent>(() => getItemTypeIcon('folder'), []);
  const ApplicationIcon = useMemo<SvgIconComponent>(() => getItemTypeIcon('application'), []);
  const InstanceIcon = useMemo<SvgIconComponent>(() => getItemTypeIcon('instance'), []);

  return (
    <>
      <IconButton size={'small'} ref={anchorRef} onClick={openHandler}>
        <AddOutlined fontSize={'small'} />
      </IconButton>

      <MenuPopover open={open} onClose={closeHandler} anchorEl={anchorRef.current}>
        <MenuItem onClick={createFolderHandler}>
          <ListItemIcon>
            <FolderIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id={'createFolder'} />
          </ListItemText>
        </MenuItem>
        <MenuItem onClick={createApplicationHandler}>
          <ListItemIcon>
            <ApplicationIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id={'createApplication'} />
          </ListItemText>
        </MenuItem>
        <MenuItem onClick={createInstanceHandler}>
          <ListItemIcon>
            <InstanceIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id={'createInstance'} />
          </ListItemText>
        </MenuItem>
      </MenuPopover>
    </>
  );
}
