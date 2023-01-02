import ContextMenuPopper from 'renderer/components/menu/popup/ContextMenuPopper';
import { TreeItemContextMenuProps } from 'renderer/layout/navigator/components/sidebar/tree/tree';
import DeleteMenuItem from 'renderer/layout/navigator/components/sidebar/tree/menus/items/DeleteMenuItem';
import RenameMenuItem from 'renderer/layout/navigator/components/sidebar/tree/menus/items/RenameMenuItem';
import ChooseColorMenuItem from 'renderer/layout/navigator/components/sidebar/tree/menus/items/ChooseColorMenuItem';
import { Divider } from '@mui/material';
import UpdateMenuItem from 'renderer/layout/navigator/components/sidebar/tree/menus/items/UpdateMenuItem';
import CopyIdToClipboardMenuItem from 'renderer/layout/navigator/components/sidebar/tree/menus/items/CopyIdToClipboardMenuItem';

export default function InstanceContextMenu({
  item,
  node,
  open,
  anchorEl,
  placement,
  onClose,
  onCreated,
  sx,
}: TreeItemContextMenuProps) {
  return (
    <ContextMenuPopper open={open} onClose={onClose} anchorEl={anchorEl} placement={placement} sx={sx}>
      <ChooseColorMenuItem item={item} onClose={onClose} />
      <Divider />
      <CopyIdToClipboardMenuItem item={item} onClose={onClose} />
      <UpdateMenuItem item={item} onClose={onClose} />
      <RenameMenuItem item={item} node={node} onClose={onClose} />
      <DeleteMenuItem item={item} onClose={onClose} />
    </ContextMenuPopper>
  );
}
