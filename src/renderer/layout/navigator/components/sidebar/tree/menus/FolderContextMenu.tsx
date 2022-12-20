import { useCallback, useMemo } from 'react';
import { Divider, ListItemIcon, ListItemText, MenuItem } from '@mui/material';
import { DeleteOutlined, SvgIconComponent } from '@mui/icons-material';
import { FormattedMessage } from 'react-intl';
import { getItemTypeIcon } from 'renderer/utils/itemUtils';
import NiceModal from '@ebay/nice-modal-react';
import CreateFolderDialog from 'renderer/layout/navigator/components/sidebar/create/CreateFolderDialog';
import { Folder, Item } from 'infra/configuration/model/configuration';
import ContextMenuPopper from 'renderer/components/menu/ContextMenuPopper';
import ConfirmationDialog from 'renderer/components/dialog/ConfirmationDialog';
import { useDeleteFolder } from 'renderer/apis/configuration/deleteFolder';
import { chain } from 'lodash';

type FolderContextMenuProps = {
  item: Folder & { children?: Item[] };
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
      order: item.children?.length
        ? chain(item.children)
            .map<number>((c) => c.order ?? 0)
            .max()
            .value() + 1
        : 1,
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

  const deleteFolderState = useDeleteFolder();

  const deleteFolderHandler = useCallback(async (): Promise<void> => {
    onClose?.();

    const confirm = await NiceModal.show<boolean>(ConfirmationDialog, {
      title: <FormattedMessage id={'delete'} />,
      text: <FormattedMessage id={'areYouSure'} />,
      continueText: <FormattedMessage id={'delete'} />,
    });
    if (!confirm) {
      return;
    }

    try {
      await deleteFolderState.mutateAsync({ id: item.id });
    } catch (e) {}
  }, [onClose, item]);

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
      <Divider />
      <MenuItem onClick={deleteFolderHandler} sx={{ color: 'error.main' }}>
        <ListItemIcon>
          <DeleteOutlined fontSize="small" />
        </ListItemIcon>
        <ListItemText>
          <FormattedMessage id={'delete'} />
        </ListItemText>
      </MenuItem>
    </ContextMenuPopper>
  );
}
