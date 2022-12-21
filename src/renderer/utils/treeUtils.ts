import { chain } from 'lodash';
import { TreeItem } from 'renderer/layout/navigator/components/sidebar/tree/tree';
import { NodeApi } from 'react-arborist';

export const getNewItemOrder = (node: NodeApi<TreeItem>): number => {
  return node.data.children?.length
    ? chain(node.data.children)
        .map<number>((c) => c.order ?? 0)
        .max()
        .value() + 1
    : 1;
};
