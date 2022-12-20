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
import { useNavigatorTree } from 'renderer/contexts/NavigatorTreeContext';
import { chain } from 'lodash';

export default function CreateItemMenu() {
  const { data } = useNavigatorTree();

  const anchorRef = useRef<HTMLButtonElement | null>(null);
  const [open, setOpen] = useState<boolean>(false);

  const createFolderHandler = useCallback((): void => {
    if (!data) {
      return;
    }
    NiceModal.show<Folder | undefined>(CreateFolderDialog, {
      order: data.length
        ? chain(data)
            .map<number>((item) => item.order ?? 0)
            .max()
            .value() + 1
        : 1,
      onCreated: (item: Folder) => {},
    });
    setOpen(false);
  }, [data, setOpen]);

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
