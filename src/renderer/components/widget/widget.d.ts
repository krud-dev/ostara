import { ItemRO } from '../../definitions/daemon';

export interface DashboardWidgetCardProps<W extends Widget> {
  widget: W;
  item: ItemRO;
  intervalSeconds: number;
}

export type BaseWidgetDefinition = {
  id: string;
  type: string;
  title: string;
  description: string;
};

export type StackedTimelineWidget = BaseWidgetDefinition & {
  type: 'stacked-timeline';
  metrics: {
    name: string;
    title: string;
    order: number;
    color: string;
    valueType: WidgetValueType;
  }[];
};

export type DataBarWidget = BaseWidgetDefinition & {
  type: 'data-bar';
  metrics: {
    name: string;
    title: string;
    order: number;
    valueType: WidgetValueType;
  }[];
};

export type ProgressCircleWidget = BaseWidgetDefinition & {
  type: 'progress-circle';
  valueType: WidgetValueType;
  maxMetricName: string;
  currentMetricName: string;
  title: string;
  color: string;
  colorThresholds: {
    value: number;
    color: string;
  }[];
};

export type Widget = StackedTimelineWidget | DataBarWidget | ProgressCircleWidget;

export type WidgetValueType =
  | 'number'
  | 'string'
  | 'boolean'
  | 'object'
  | 'array'
  | 'null'
  | 'undefined'
  | 'bytes'
  | 'seconds';
