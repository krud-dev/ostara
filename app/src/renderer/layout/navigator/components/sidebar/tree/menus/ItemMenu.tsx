import React from 'react';
import MenuPopover from 'renderer/components/menu/popup/MenuPopover';
import { bindMenu } from 'material-ui-popup-state/hooks';
import { TreeItemMenuProps } from 'renderer/layout/navigator/components/sidebar/tree/tree';
import FolderMenuItems from 'renderer/layout/navigator/components/sidebar/tree/menus/FolderMenuItems';
import ApplicationMenuItems from 'renderer/layout/navigator/components/sidebar/tree/menus/ApplicationMenuItems';
import InstanceMenuItems from 'renderer/layout/navigator/components/sidebar/tree/menus/InstanceMenuItems';
import { isApplication, isFolder, isInstance } from '../../../../../../utils/itemUtils';

type ItemMenuProps = TreeItemMenuProps;

export default function ItemMenu(props: ItemMenuProps) {
  const { item, menuState } = props;
  return (
    <MenuPopover {...bindMenu(menuState)}>
      {isFolder(item) && <FolderMenuItems {...props} menuState={menuState} />}
      {isApplication(item) && <ApplicationMenuItems {...props} menuState={menuState} />}
      {isInstance(item) && <InstanceMenuItems {...props} menuState={menuState} />}
    </MenuPopover>
  );
}
