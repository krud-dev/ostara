import { MUIconType } from 'renderer/components/common/IconViewer';
import { ComponentType } from 'react';
import { ColorSchema } from 'renderer/theme/config/palette';
import { LabelColor } from 'renderer/components/common/Label';

export type Entity<EntityItem> = {
  id: string;
  columns: EntityColumn<EntityItem>[];
  actions: EntityAction[];
  massActions: EntityAction[];
  globalActions: EntityAction[];
  rowAction?: EntityRowAction<EntityItem>;
  isRowActionActive?: (item: EntityItem) => boolean;
  defaultOrder: {
    id: string;
    direction: 'asc' | 'desc';
  }[];
  paging: boolean;
  getId: (item: EntityItem) => string;
  getAnchor?: (item: EntityItem) => string;
  getGrouping?: (item: EntityItem) => string;
  groupingTreeSeparator?: string;
  filterData: (data: EntityItem[], filter: string) => EntityItem[];
};

export type EntityBaseColumn<EntityItem> = {
  id: string;
  align?: 'left' | 'right' | 'center';
  labelId: string;
  width?: number;
  getTooltip?: (item: EntityItem) => string | undefined;
};

export type EntityTextColumn<EntityItem> = EntityBaseColumn<EntityItem> & {
  readonly type: 'Text';
};

export type EntityNumberColumn<EntityItem> = EntityBaseColumn<EntityItem> & {
  readonly type: 'Number';
  round?: number;
};

export type EntityCronColumn<EntityItem> = EntityBaseColumn<EntityItem> & {
  readonly type: 'Cron';
};

export type EntityDateColumn<EntityItem> = EntityBaseColumn<EntityItem> & {
  readonly type: 'Date';
};

export type EntityLabelColumn<EntityItem> = EntityBaseColumn<EntityItem> & {
  readonly type: 'Label';
  getColor: (item: EntityItem) => LabelColor;
};

export type EntityCustomColumn<EntityItem> = EntityBaseColumn<EntityItem> & {
  readonly type: 'Custom';
  Component: ComponentType<{ column: EntityBaseColumn<EntityItem>; row: EntityItem }>;
};

export type EntityColumn<EntityItem> =
  | EntityTextColumn<EntityItem>
  | EntityNumberColumn<EntityItem>
  | EntityCronColumn<EntityItem>
  | EntityDateColumn<EntityItem>
  | EntityLabelColumn<EntityItem>
  | EntityCustomColumn<EntityItem>;

export type EntityRowActionNavigate<EntityItem> = {
  readonly type: 'Navigate';
  getUrl: (item: EntityItem) => string;
};

export type EntityRowActionDetails<EntityItem> = {
  readonly type: 'Details';
  Component: ComponentType<{ row: EntityItem }>;
};

export type EntityRowAction<EntityItem> = EntityRowActionNavigate<EntityItem> | EntityRowActionDetails<EntityItem>;

export type EntityAction = {
  id: string;
  labelId: string;
  icon: MUIconType;
};
