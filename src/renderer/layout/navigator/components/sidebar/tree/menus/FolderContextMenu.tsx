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
import React from 'react';
import { ContextMenuContext } from 'renderer/components/menu/popup/ContextMenuContext';

export default function FolderContextMenu({ item, node, onCreated, ...props }: TreeItemContextMenuProps) {
  return (
    <ContextMenuPopper {...props}>
      <ContextMenuContext.Consumer>
        {({ menuState: { close } }) => (
          <>
            {node && (
              <>
                <AddFolderMenuItem node={node} onClose={close} onCreated={onCreated} />
                <AddApplicationMenuItem node={node} onClose={close} onCreated={onCreated} />
                <AddInstanceMenuItem node={node} onClose={close} onCreated={onCreated} />
                <Divider />
              </>
            )}
            <ChooseColorMenuItem item={item} onClose={close} />
            <Divider />
            <CopyIdToClipboardMenuItem item={item} onClose={close} />
            <UpdateMenuItem item={item} onClose={close} />
            <RenameMenuItem item={item} node={node} onClose={close} />
            <DeleteMenuItem item={item} onClose={close} />
          </>
        )}
      </ContextMenuContext.Consumer>
    </ContextMenuPopper>
  );
}
