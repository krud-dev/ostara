import { NodeRendererProps } from 'react-arborist';
import React, { useCallback, useMemo, useRef } from 'react';
import { TreeItem } from 'renderer/layout/navigator/components/sidebar/tree/tree';
import { getItemUrl } from 'renderer/utils/itemUtils';
import { matchPath, useLocation, useNavigate } from 'react-router-dom';
import ItemMenu from 'renderer/layout/navigator/components/sidebar/tree/menus/ItemMenu';
import { usePopupState } from 'material-ui-popup-state/hooks';
import ItemContextMenu from 'renderer/layout/navigator/components/sidebar/tree/menus/ItemContextMenu';
import { ItemRO } from 'renderer/definitions/daemon';
import NavigatorTreeNodeBase from 'renderer/layout/navigator/components/sidebar/tree/nodes/NavigatorTreeNodeBase';

type NavigatorTreeNodeProps = NodeRendererProps<TreeItem>;

export default function NavigatorTreeNode(props: NavigatorTreeNodeProps) {
  const { node } = props;
  const navigate = useNavigate();
  const { pathname } = useLocation();

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

  const itemClickHandler = useCallback(
    (event: React.MouseEvent): void => {
      navigate(getItemUrl(node.data));
    },
    [node]
  );

  const childItemCreatedHandler = useCallback(
    (items: ItemRO[]): void => {
      node.open();
    },
    [node]
  );

  const isSelected = useMemo<boolean>(
    () => matchPath({ path: getItemUrl(node.data), end: false }, pathname) !== null,
    [node.data, pathname]
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

      <NavigatorTreeNodeBase
        {...props}
        isSelected={isSelected}
        menuState={menuState}
        contextMenuRef={contextMenuRef}
        onClick={itemClickHandler}
      />
    </>
  );
}
