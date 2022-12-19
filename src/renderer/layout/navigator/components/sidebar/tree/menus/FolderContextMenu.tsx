import { useCallback, useMemo } from 'react';
import { ListItemIcon, ListItemText, MenuItem } from '@mui/material';
import { SvgIconComponent } from '@mui/icons-material';
import { FormattedMessage } from 'react-intl';
import { getItemTypeIcon } from 'renderer/utils/itemUtils';
import NiceModal from '@ebay/nice-modal-react';
import CreateFolderDialog from 'renderer/layout/navigator/components/sidebar/create/CreateFolderDialog';
import { Folder, Item } from 'infra/configuration/model/configuration';
import ContextMenuPopper from 'renderer/components/menu/ContextMenuPopper';

type FolderContextMenuProps = {
  item: Folder;
  open: boolean;
  anchorEl?: Element | null;
  onClose?: () => void;
  onCreated?: (item: Item) => void;
};

export default function FolderContextMenu({
  item,
  open,
  anchorEl,
  onClose,
  onCreated,
}: FolderContextMenuProps) {
  const createFolderHandler = useCallback((): void => {
    NiceModal.show<Folder | undefined>(CreateFolderDialog, {
      parentFolderId: item.id,
      onCreated: onCreated,
    });
    onClose?.();
  }, [onClose]);

  const createApplicationHandler = useCallback((): void => {
    onClose?.();
  }, [onClose]);

  const createInstanceHandler = useCallback((): void => {
    onClose?.();
  }, [onClose]);

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
    <ContextMenuPopper open={open} onClose={onClose} anchorEl={anchorEl}>
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
    </ContextMenuPopper>
  );
}
