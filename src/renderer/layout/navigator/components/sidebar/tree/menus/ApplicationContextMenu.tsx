import { Divider } from '@mui/material';
import ContextMenuPopper from 'renderer/components/menu/ContextMenuPopper';
import { TreeItemContextMenuProps } from 'renderer/layout/navigator/components/sidebar/tree/tree';
import DeleteMenuItem from 'renderer/layout/navigator/components/sidebar/tree/menus/items/DeleteMenuItem';
import RenameMenuItem from 'renderer/layout/navigator/components/sidebar/tree/menus/items/RenameMenuItem';
import AddInstanceMenuItem from 'renderer/layout/navigator/components/sidebar/tree/menus/items/AddInstanceMenuItem';

export default function ApplicationContextMenu({ node, open, anchorEl, onClose, onCreated }: TreeItemContextMenuProps) {
  return (
    <ContextMenuPopper open={open} onClose={onClose} anchorEl={anchorEl}>
      <AddInstanceMenuItem node={node} onClose={onClose} onCreated={onCreated} />
      <Divider />
      <RenameMenuItem node={node} onClose={onClose} />
      <DeleteMenuItem node={node} onClose={onClose} />
    </ContextMenuPopper>
  );
}
