import { Divider } from '@mui/material';
import ContextMenuPopper from 'renderer/components/menu/ContextMenuPopper';
import { TreeItemContextMenuProps } from 'renderer/layout/navigator/components/sidebar/tree/tree';
import DeleteMenuItem from 'renderer/layout/navigator/components/sidebar/tree/menus/items/DeleteMenuItem';
import RenameMenuItem from 'renderer/layout/navigator/components/sidebar/tree/menus/items/RenameMenuItem';
import AddInstanceMenuItem from 'renderer/layout/navigator/components/sidebar/tree/menus/items/AddInstanceMenuItem';
import AddApplicationMenuItem from 'renderer/layout/navigator/components/sidebar/tree/menus/items/AddApplicationMenuItem';
import AddFolderMenuItem from 'renderer/layout/navigator/components/sidebar/tree/menus/items/AddFolderMenuItem';
import ChooseColorMenuItem from 'renderer/layout/navigator/components/sidebar/tree/menus/items/ChooseColorMenuItem';

export default function FolderContextMenu({ node, open, anchorEl, onClose, onCreated }: TreeItemContextMenuProps) {
  return (
    <ContextMenuPopper open={open} onClose={onClose} anchorEl={anchorEl}>
      <AddFolderMenuItem node={node} onClose={onClose} onCreated={onCreated} />
      <AddApplicationMenuItem node={node} onClose={onClose} onCreated={onCreated} />
      <AddInstanceMenuItem node={node} onClose={onClose} onCreated={onCreated} />
      <Divider />
      <ChooseColorMenuItem node={node} onClose={onClose} />
      <Divider />
      <RenameMenuItem node={node} onClose={onClose} />
      <DeleteMenuItem node={node} onClose={onClose} />
    </ContextMenuPopper>
  );
}
