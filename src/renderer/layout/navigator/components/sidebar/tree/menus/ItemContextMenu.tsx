import ContextMenuPopper from 'renderer/components/menu/popup/ContextMenuPopper';
import { TreeItemContextMenuProps } from 'renderer/layout/navigator/components/sidebar/tree/tree';
import { ContextMenuContext } from 'renderer/components/menu/popup/ContextMenuContext';
import React from 'react';
import { isApplication, isFolder, isInstance } from 'infra/configuration/model/configuration';
import FolderMenuItems from 'renderer/layout/navigator/components/sidebar/tree/menus/FolderMenuItems';
import ApplicationMenuItems from 'renderer/layout/navigator/components/sidebar/tree/menus/ApplicationMenuItems';
import InstanceMenuItems from 'renderer/layout/navigator/components/sidebar/tree/menus/InstanceMenuItems';

export default function ItemContextMenu(props: TreeItemContextMenuProps) {
  const { node, item, onCreated, ...rest } = props;
  return (
    <ContextMenuPopper {...rest}>
      <ContextMenuContext.Consumer>
        {({ menuState }) => (
          <>
            {isFolder(item) && <FolderMenuItems {...props} menuState={menuState} />}
            {isApplication(item) && <ApplicationMenuItems {...props} menuState={menuState} />}
            {isInstance(item) && <InstanceMenuItems {...props} menuState={menuState} />}
          </>
        )}
      </ContextMenuContext.Consumer>
    </ContextMenuPopper>
  );
}
