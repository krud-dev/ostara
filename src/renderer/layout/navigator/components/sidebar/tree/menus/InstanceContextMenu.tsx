import ContextMenuPopper from 'renderer/components/menu/ContextMenuPopper';
import { TreeItemContextMenuProps } from 'renderer/layout/navigator/components/sidebar/tree/tree';
import DeleteMenuItem from 'renderer/layout/navigator/components/sidebar/tree/menus/items/DeleteMenuItem';
import RenameMenuItem from 'renderer/layout/navigator/components/sidebar/tree/menus/items/RenameMenuItem';
import ChooseColorMenuItem from 'renderer/layout/navigator/components/sidebar/tree/menus/items/ChooseColorMenuItem';
import { Divider } from '@mui/material';

export default function InstanceContextMenu({ node, open, anchorEl, onClose, onCreated }: TreeItemContextMenuProps) {
  return (
    <ContextMenuPopper open={open} onClose={onClose} anchorEl={anchorEl}>
      <ChooseColorMenuItem node={node} onClose={onClose} />
      <Divider />
      <RenameMenuItem node={node} onClose={onClose} />
      <DeleteMenuItem node={node} onClose={onClose} />
    </ContextMenuPopper>
  );
}
