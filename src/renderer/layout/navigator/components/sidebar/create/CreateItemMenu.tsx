import { useCallback, useMemo, useRef, useState } from 'react';
import {
  IconButton,
  ListItemIcon,
  ListItemText,
  MenuItem,
} from '@mui/material';
import MenuPopover from 'renderer/components/menu/MenuPopover';
import { AddOutlined, SvgIconComponent } from '@mui/icons-material';
import { FormattedMessage } from 'react-intl';
import { getItemTypeIcon } from 'renderer/utils/itemUtils';
import NiceModal from '@ebay/nice-modal-react';
import CreateFolderDialog from 'renderer/layout/navigator/components/sidebar/create/CreateFolderDialog';
import { Folder } from 'infra/configuration/model/configuration';

export default function CreateItemMenu() {
  const anchorRef = useRef<HTMLButtonElement | null>(null);
  const [open, setOpen] = useState<boolean>(false);

  const createFolderHandler = useCallback((): void => {
    NiceModal.show<Folder | undefined>(CreateFolderDialog, {
      onCreated: (item: Folder) => {},
    });
    setOpen(false);
  }, [setOpen]);

  const createApplicationHandler = useCallback((): void => {
    setOpen(false);
  }, [setOpen]);

  const createInstanceHandler = useCallback((): void => {
    setOpen(false);
  }, [setOpen]);

  const FolderIcon = useMemo<SvgIconComponent>(
    () => getItemTypeIcon('folder'),
    []
  );
  const ApplicationIcon = useMemo<SvgIconComponent>(
    () => getItemTypeIcon('application'),
    []
  );
  const InstanceIcon = useMemo<SvgIconComponent>(
    () => getItemTypeIcon('instance'),
    []
  );

  return (
    <>
      <IconButton size={'small'} ref={anchorRef} onClick={() => setOpen(true)}>
        <AddOutlined fontSize={'small'} />
      </IconButton>

      <MenuPopover
        open={open}
        onClose={() => setOpen(false)}
        anchorEl={anchorRef.current}
      >
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
