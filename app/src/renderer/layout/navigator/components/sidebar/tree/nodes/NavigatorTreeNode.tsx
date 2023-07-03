import { NodeRendererProps } from 'react-arborist';
import React, { useCallback, useRef } from 'react';
import { TreeItem } from 'renderer/layout/navigator/components/sidebar/tree/tree';
import ItemMenu from 'renderer/layout/navigator/components/sidebar/tree/menus/ItemMenu';
import { usePopupState } from 'material-ui-popup-state/hooks';
import ItemContextMenu from 'renderer/layout/navigator/components/sidebar/tree/menus/ItemContextMenu';
import { ItemRO } from 'renderer/definitions/daemon';
import NavigatorTreeNodeBase from 'renderer/layout/navigator/components/sidebar/tree/nodes/NavigatorTreeNodeBase';

type NavigatorTreeNodeProps = NodeRendererProps<TreeItem>;

export default function NavigatorTreeNode(props: NavigatorTreeNodeProps) {
  const { node } = props;

  const menuState = usePopupState({ variant: 'popover' });

  const contextMenuRef = useRef<HTMLElement | null>(null);

  const onContextMenuChange = useCallback(
    (open: boolean): void => {
      if (open) {
        node.focus();
      }
    },
    [node]
  );

  const childItemCreatedHandler = useCallback(
    (items: ItemRO[]): void => {
      node.open();
    },
    [node]
  );

  return (
    <>
      <ItemMenu node={node} item={node.data} onCreated={childItemCreatedHandler} menuState={menuState} />
      <ItemContextMenu
        node={node}
        item={node.data}
        onCreated={childItemCreatedHandler}
        contextMenuRef={contextMenuRef}
        onContextMenuChange={onContextMenuChange}
      />

      <NavigatorTreeNodeBase {...props} menuState={menuState} contextMenuRef={contextMenuRef} />
    </>
  );
}
