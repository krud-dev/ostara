import { MUIconType } from 'renderer/components/common/IconViewer';
import { ComponentType, ReactNode } from 'react';
import { LabelColor } from 'renderer/components/common/Label';

export type Entity<EntityItem, CustomFilters = never> = {
  id: string;
  columns: EntityColumn<EntityItem>[];
  actions: EntityAction<EntityItem>[];
  massActions: EntityActionMass[];
  globalActions: EntityActionGlobal[];
  rowAction?: EntityRowAction<EntityItem>;
  isRowActionActive?: (item: EntityItem) => boolean;
  defaultOrder: {
    id: string;
    direction: 'asc' | 'desc';
  }[];
  paging: boolean;
  getId: (item: EntityItem) => string;
  getAnchor?: (item: EntityItem) => string;
  filterData: (data: EntityItem[], filter: string, customFilters?: CustomFilters) => EntityItem[];
  CustomFiltersComponent?: ComponentType<{ onChange?: (customFilters?: CustomFilters) => void }>;
};

export type EntityBaseColumn<EntityItem> = {
  id: string;
  align?: 'left' | 'right' | 'center';
  labelId: string;
  width?: number | string;
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

export type EntityParsedDateColumn<EntityItem> = EntityBaseColumn<EntityItem> & {
  readonly type: 'ParsedDate';
};

export type EntityBytesColumn<EntityItem> = EntityBaseColumn<EntityItem> & {
  readonly type: 'Bytes';
};

export type EntityLabelColumn<EntityItem> = EntityBaseColumn<EntityItem> & {
  readonly type: 'Label';
  getColor: (item: EntityItem) => LabelColor;
  getText?: (item: EntityItem) => ReactNode;
};

export type EntityCountdownColumn<EntityItem> = EntityBaseColumn<EntityItem> & {
  readonly type: 'Countdown';
  isSeconds?: boolean;
};

export type EntityIntervalColumn<EntityItem> = EntityBaseColumn<EntityItem> & {
  readonly type: 'Interval';
  isSeconds?: boolean;
};

export type EntityCustomTextColumn<EntityItem> = EntityBaseColumn<EntityItem> & {
  readonly type: 'CustomText';
  getText: (item: EntityItem) => ReactNode;
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
  | EntityParsedDateColumn<EntityItem>
  | EntityBytesColumn<EntityItem>
  | EntityLabelColumn<EntityItem>
  | EntityCountdownColumn<EntityItem>
  | EntityIntervalColumn<EntityItem>
  | EntityCustomTextColumn<EntityItem>
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

export type EntityActionBase = {
  id: string;
  labelId: string;
  icon: MUIconType;
};

export type EntityAction<EntityItem> = EntityActionBase & {
  isDisabled?: (item: EntityItem) => boolean;
};

export type EntityActionMass = EntityActionBase;

export type EntityActionGlobal = EntityActionBase;
