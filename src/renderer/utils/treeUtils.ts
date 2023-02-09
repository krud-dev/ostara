import { chain, forEach } from 'lodash';
import { TreeItem } from 'renderer/layout/navigator/components/sidebar/tree/tree';
import { NodeApi } from 'react-arborist';
import { ItemRO } from '../definitions/daemon';
import { isInstance } from './itemUtils';

export const getNewItemSort = (node: NodeApi<TreeItem>): number => {
  return node.data.children?.length
    ? chain(node.data.children)
        .map<number>((c) => c.sort ?? 0)
        .max()
        .value() + 1
    : 1;
};

export const buildTree = (items: ItemRO[]): TreeItem[] => {
  const sortByOrder = (itemsToSort: ItemRO[]) => itemsToSort.sort((a, b) => (a.sort ?? 0) - (b.sort ?? 0));

  const hashMap = new Map<string, TreeItem>();
  forEach(items, (item) => {
    hashMap.set(item.id, { ...item, children: [] });
  });

  const dataTree: TreeItem[] = [];
  forEach(items, (item) => {
    if (isInstance(item)) {
      const treeItem = hashMap.get(item.id);
      if (treeItem && item.parentApplicationId) {
        const parentChildren = hashMap.get(item.parentApplicationId)?.children;
        if (parentChildren) {
          parentChildren.push(treeItem);
          sortByOrder(parentChildren);
        }
      }
    } else {
      const treeItem = hashMap.get(item.id);
      if (treeItem) {
        if (item.parentFolderId) {
          const parentChildren = hashMap.get(item.parentFolderId)?.children;
          if (parentChildren) {
            parentChildren.push(treeItem);
            sortByOrder(parentChildren);
          }
        } else {
          dataTree.push(treeItem);
        }
      }
    }
  });

  sortByOrder(dataTree);
  return dataTree;
};
