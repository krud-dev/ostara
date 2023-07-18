import { NodeRendererProps } from 'react-arborist';
import React from 'react';
import { TreeItem } from 'renderer/layout/navigator/components/sidebar/tree/tree';
import NavigatorTreeNodeBase from 'renderer/layout/navigator/components/sidebar/tree/nodes/NavigatorTreeNodeBase';

type NavigatorTreeNodePreviewProps = NodeRendererProps<TreeItem>;

export default function NavigatorTreeNodePreview(props: NavigatorTreeNodePreviewProps) {
  return <NavigatorTreeNodeBase {...props} hideHealthStatus />;
}
