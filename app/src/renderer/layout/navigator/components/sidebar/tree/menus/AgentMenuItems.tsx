import { TreeItemMenuProps } from 'renderer/layout/navigator/components/sidebar/tree/tree';
import DeleteMenuItem from 'renderer/layout/navigator/components/sidebar/tree/menus/items/DeleteMenuItem';
import RenameMenuItem from 'renderer/layout/navigator/components/sidebar/tree/menus/items/RenameMenuItem';
import ChooseColorMenuItem from 'renderer/layout/navigator/components/sidebar/tree/menus/items/ChooseColorMenuItem';
import UpdateMenuItem from 'renderer/layout/navigator/components/sidebar/tree/menus/items/UpdateMenuItem';
import CopyIdToClipboardMenuItem from 'renderer/layout/navigator/components/sidebar/tree/menus/items/CopyIdToClipboardMenuItem';
import React from 'react';
import CopyItemToClipboardMenuItem from './items/CopyItemToClipboardMenuItem';
import MenuDivider from '../../../../../../components/menu/item/MenuDivider';

export default function AgentMenuItems({ item, node, onCreated, menuState }: TreeItemMenuProps) {
  const { close } = menuState;
  return (
    <>
      <ChooseColorMenuItem item={item} onClose={close} />
      <MenuDivider />
      <CopyIdToClipboardMenuItem item={item} onClose={close} />
      <CopyItemToClipboardMenuItem item={item} onClose={close} />
      <UpdateMenuItem item={item} onClose={close} />
      <RenameMenuItem item={item} node={node} onClose={close} />
      <DeleteMenuItem item={item} onClose={close} />
    </>
  );
}