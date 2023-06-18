import { NodeRendererProps } from 'react-arborist';
import React, { useCallback } from 'react';
import { TreeItem } from 'renderer/layout/navigator/components/sidebar/tree/tree';
import NavigatorTreeNodeBase from 'renderer/layout/navigator/components/sidebar/tree/nodes/NavigatorTreeNodeBase';

type NavigatorTreeNodePreviewProps = NodeRendererProps<TreeItem>;

export default function NavigatorTreeNodePreview(props: NavigatorTreeNodePreviewProps) {
  const { node } = props;

  const itemClickHandler = useCallback((event: React.MouseEvent): void => {}, [node]);

  return <NavigatorTreeNodeBase {...props} onClick={itemClickHandler} />;
}
