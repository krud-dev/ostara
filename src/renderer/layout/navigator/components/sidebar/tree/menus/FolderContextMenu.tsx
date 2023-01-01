import { Divider } from '@mui/material';
import ContextMenuPopper from 'renderer/components/menu/popup/ContextMenuPopper';
import { TreeItemContextMenuProps } from 'renderer/layout/navigator/components/sidebar/tree/tree';
import DeleteMenuItem from 'renderer/layout/navigator/components/sidebar/tree/menus/items/DeleteMenuItem';
import RenameMenuItem from 'renderer/layout/navigator/components/sidebar/tree/menus/items/RenameMenuItem';
import AddInstanceMenuItem from 'renderer/layout/navigator/components/sidebar/tree/menus/items/AddInstanceMenuItem';
import AddApplicationMenuItem from 'renderer/layout/navigator/components/sidebar/tree/menus/items/AddApplicationMenuItem';
import AddFolderMenuItem from 'renderer/layout/navigator/components/sidebar/tree/menus/items/AddFolderMenuItem';
import ChooseColorMenuItem from 'renderer/layout/navigator/components/sidebar/tree/menus/items/ChooseColorMenuItem';
import UpdateMenuItem from 'renderer/layout/navigator/components/sidebar/tree/menus/items/UpdateMenuItem';
import CopyIdToClipboardMenuItem from 'renderer/layout/navigator/components/sidebar/tree/menus/items/CopyIdToClipboardMenuItem';
import ChooseIconMenuItem from 'renderer/layout/navigator/components/sidebar/tree/menus/items/ChooseIconMenuItem';

export default function FolderContextMenu({
  item,
  node,
  open,
  anchorEl,
  onClose,
  onCreated,
  sx,
}: TreeItemContextMenuProps) {
  return (
    <ContextMenuPopper open={open} onClose={onClose} anchorEl={anchorEl} sx={sx}>
      {node && (
        <>
          <AddFolderMenuItem node={node} onClose={onClose} onCreated={onCreated} />
          <AddApplicationMenuItem node={node} onClose={onClose} onCreated={onCreated} />
          <AddInstanceMenuItem node={node} onClose={onClose} onCreated={onCreated} />
          <Divider />
        </>
      )}
      <ChooseColorMenuItem item={item} onClose={onClose} />
      <Divider />
      <CopyIdToClipboardMenuItem item={item} onClose={onClose} />
      <UpdateMenuItem item={item} onClose={onClose} />
      <RenameMenuItem item={item} node={node} onClose={onClose} />
      <ChooseIconMenuItem item={item} onClose={onClose} />
      <DeleteMenuItem item={item} onClose={onClose} />
    </ContextMenuPopper>
  );
}
