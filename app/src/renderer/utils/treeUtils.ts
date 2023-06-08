import { chain, forEach } from 'lodash';
import { TreeItem } from 'renderer/layout/navigator/components/sidebar/tree/tree';
import { NodeApi } from 'react-arborist';
import { ItemRO } from '../definitions/daemon';
import { isInstance } from './itemUtils';

export const getNewItemSort = (treeItem: TreeItem): number => {
  return treeItem.children?.length
    ? chain(treeItem.children)
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

export const getSubTreeRoot = (tree: TreeItem[], id: string): TreeItem | undefined => {
  return tree
    .map((item) => {
      if (item.id === id) {
        return item;
      }
      if (item.children) {
        return getSubTreeRoot(item.children, id);
      }
      return undefined;
    })
    .find((item) => !!item);
};

const getSubTreeItems = (root: TreeItem): TreeItem[] => {
  return [root, ...(root.children?.map((item) => getSubTreeItems(item)).flat() ?? [])];
};

export const getSubTreeItemsForItem = (tree: TreeItem[], itemId: string): TreeItem[] => {
  const root = getSubTreeRoot(tree, itemId);
  if (!root) {
    return [];
  }
  return getSubTreeItems(root).map((item) => item);
};

export const findTreeItemPath = (tree: TreeItem[], id: string, inclusive = false): TreeItem[] | null => {
  for (const item of tree) {
    if (item.id === id) {
      // If the current item has the desired id, return it as a single-item path
      return inclusive ? [item] : [];
    }

    if (item.children?.length) {
      // Recursively search for the item in the children
      const childPath = findTreeItemPath(item.children, id);
      if (childPath !== null) {
        // If the item is found in the children, prepend the current item to the path and return it
        return [item, ...childPath];
      }
    }
  }

  // If the item is not found in the current tree or its children, return null
  return null;
};
