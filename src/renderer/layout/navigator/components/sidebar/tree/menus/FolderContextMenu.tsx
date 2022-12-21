import { useCallback, useMemo } from 'react';
import { Divider, ListItemIcon, ListItemText, MenuItem } from '@mui/material';
import { DeleteOutlined, EditOutlined, SvgIconComponent } from '@mui/icons-material';
import { FormattedMessage } from 'react-intl';
import { getItemTypeIcon } from 'renderer/utils/itemUtils';
import NiceModal from '@ebay/nice-modal-react';
import CreateFolderDialog from 'renderer/layout/navigator/components/sidebar/create/CreateFolderDialog';
import { Folder, Item } from 'infra/configuration/model/configuration';
import ContextMenuPopper from 'renderer/components/menu/ContextMenuPopper';
import ConfirmationDialog from 'renderer/components/dialog/ConfirmationDialog';
import { useDeleteFolder } from 'renderer/apis/configuration/folder/deleteFolder';
import { chain } from 'lodash';
import { NodeApi } from 'react-arborist';
import { TreeItem } from 'renderer/layout/navigator/components/sidebar/tree/tree';

type FolderContextMenuProps = {
  node: NodeApi<TreeItem>;
  open: boolean;
  anchorEl?: Element | null;
  onClose?: () => void;
  onCreated?: (item: Item) => void;
};

export default function FolderContextMenu({ node, open, anchorEl, onClose, onCreated }: FolderContextMenuProps) {
  const createFolderHandler = useCallback((): void => {
    onClose?.();

    NiceModal.show<Folder | undefined>(CreateFolderDialog, {
      parentFolderId: node.data.id,
      order: node.data.children?.length
        ? chain(node.data.children)
            .map<number>((c) => c.order ?? 0)
            .max()
            .value() + 1
        : 1,
      onCreated: onCreated,
    });
  }, [onClose]);

  const createApplicationHandler = useCallback((): void => {
    onClose?.();
  }, [onClose]);

  const createInstanceHandler = useCallback((): void => {
    onClose?.();
  }, [onClose]);

  const renameHandler = useCallback(async (): Promise<void> => {
    onClose?.();

    await node.edit();
  }, [node, onClose]);

  const deleteState = useDeleteFolder();

  const deleteHandler = useCallback(async (): Promise<void> => {
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
      await deleteState.mutateAsync({ id: node.data.id });
    } catch (e) {}
  }, [onClose, node.data]);

  const FolderIcon = useMemo<SvgIconComponent>(() => getItemTypeIcon('folder'), []);
  const ApplicationIcon = useMemo<SvgIconComponent>(() => getItemTypeIcon('application'), []);
  const InstanceIcon = useMemo<SvgIconComponent>(() => getItemTypeIcon('instance'), []);

  return (
    <ContextMenuPopper open={open} onClose={onClose} anchorEl={anchorEl}>
      <MenuItem onClick={createFolderHandler}>
        <ListItemIcon>
          <FolderIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText>
          <FormattedMessage id={'addFolder'} />
        </ListItemText>
      </MenuItem>
      <MenuItem onClick={createApplicationHandler}>
        <ListItemIcon>
          <ApplicationIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText>
          <FormattedMessage id={'addApplication'} />
        </ListItemText>
      </MenuItem>
      <MenuItem onClick={createInstanceHandler}>
        <ListItemIcon>
          <InstanceIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText>
          <FormattedMessage id={'addInstance'} />
        </ListItemText>
      </MenuItem>
      <Divider />
      <MenuItem onClick={renameHandler}>
        <ListItemIcon>
          <EditOutlined fontSize="small" />
        </ListItemIcon>
        <ListItemText>
          <FormattedMessage id={'rename'} />
        </ListItemText>
      </MenuItem>
      <MenuItem onClick={deleteHandler} sx={{ color: 'error.main' }}>
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
