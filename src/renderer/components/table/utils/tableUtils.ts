import { chain, sortBy } from 'lodash';
import { DisplayItem } from 'renderer/components/table/TableContext';
import { Entity } from 'renderer/entity/entity';

const getTableDisplayItemsRegular = <EntityItem>(
  entity: Entity<EntityItem, unknown>,
  items: EntityItem[]
): DisplayItem<EntityItem>[] => {
  return items.map<DisplayItem<EntityItem>>((item) => ({ type: 'Row', row: item }));
};

const getTableDisplayItemsGroups = <EntityItem>(
  entity: Entity<EntityItem, unknown>,
  items: EntityItem[],
  collapsedGroups: string[]
): DisplayItem<EntityItem>[] => {
  const groupItemsMap = chain(items).groupBy(entity.getGrouping).value();
  const groupKeys = Object.keys(groupItemsMap).sort();

  return groupKeys.flatMap((groupKey) => {
    const collapsed = collapsedGroups.includes(groupKey);
    return [
      { type: 'Group', group: groupKey, title: groupKey, collapsed, depth: 0 },
      ...(!collapsed ? groupItemsMap[groupKey].map<DisplayItem<EntityItem>>((row) => ({ type: 'Row', row })) : []),
    ];
  });
};

type GroupingTree = {
  [key: string]: GroupingTree;
};

const buildGroupingTree = (groupArrays: string[][]): GroupingTree => {
  return groupArrays.reduce((acc: GroupingTree, groupArray: string[]) => {
    groupArray.reduce((subTree: GroupingTree, item: string) => {
      if (!subTree[item]) {
        subTree[item] = {};
      }
      return subTree[item];
    }, acc);
    return acc;
  }, {});
};

const collapseGroupingTree = (node: GroupingTree): GroupingTree => {
  for (const key in node) {
    const child = node[key];
    if (Object.keys(child).length === 1) {
      const grandChildKey = Object.keys(child)[0];
      node[`${key}.${grandChildKey}`] = child[grandChildKey];
      delete node[key];
      collapseGroupingTree(node);
    } else {
      collapseGroupingTree(child);
    }
  }
  return node;
};

const flattenGroupingTree = <EntityItem>(
  entity: Entity<EntityItem, unknown>,
  groupingTree: GroupingTree
): { name: string; depth: number; group: string }[] => {
  const treeGroups: { name: string; depth: number; group: string }[] = [];
  const stack: { parents: string[]; current: GroupingTree; depth: number }[] = [
    { parents: [], current: groupingTree, depth: 0 },
  ];
  while (stack.length) {
    const { parents, current, depth } = stack.shift()!;
    for (const name in current) {
      treeGroups.push({ name, depth, group: [...parents, name].join(entity.groupingTreeSeparator) });
      stack.push({ parents: [...parents, name], current: current[name], depth: depth + 1 });
    }
  }
  return treeGroups;
};

const getTableDisplayItemsTree = <EntityItem>(
  entity: Entity<EntityItem, unknown>,
  items: EntityItem[],
  collapsedGroups: string[]
): DisplayItem<EntityItem>[] => {
  const groups = chain(items).groupBy(entity.getGrouping).value();
  const groupKeys = Object.keys(groups).sort();

  const groupArrays = groupKeys.map<string[]>((groupKey) => groupKey.split(entity.groupingTreeSeparator!));
  let groupingTree = buildGroupingTree(groupArrays);
  groupingTree = collapseGroupingTree(groupingTree);

  const treeGroups = flattenGroupingTree(entity, groupingTree);
  const sortedTreeGroups = sortBy(treeGroups, 'group');

  return sortedTreeGroups.flatMap((treeGroup) => {
    const hidden = collapsedGroups.some(
      (collapsedGroup) => treeGroup.group !== collapsedGroup && treeGroup.group.startsWith(collapsedGroup)
    );
    if (hidden) {
      return [];
    }

    const collapsed = collapsedGroups.includes(treeGroup.group);
    return [
      { type: 'Group', group: treeGroup.group, title: treeGroup.name, collapsed, depth: treeGroup.depth },
      ...(!collapsed
        ? groups[treeGroup.group]?.map<DisplayItem<EntityItem>>((row) => ({ type: 'Row', row })) || []
        : []),
    ];
  });
};

export const getTableDisplayItems = <EntityItem>(
  entity: Entity<EntityItem, any>,
  items: EntityItem[],
  collapsedGroups: string[]
): DisplayItem<EntityItem>[] => {
  if (!entity.getGrouping) {
    return getTableDisplayItemsRegular(entity, items);
  }
  if (!entity.groupingTreeSeparator) {
    return getTableDisplayItemsGroups(entity, items, collapsedGroups);
  }
  return getTableDisplayItemsTree(entity, items, collapsedGroups);
};
