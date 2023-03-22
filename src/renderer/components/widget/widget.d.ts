import { ItemRO } from '../../definitions/daemon';

export interface DashboardWidgetCardProps<W extends Widget> {
  widget: W;
  item: ItemRO;
  intervalSeconds: number;
}

export type BaseWidgetDefinition = {
  id: string;
  type: string;
  titleId: string;
};

export type StackedTimelineWidget = BaseWidgetDefinition & {
  type: 'stacked-timeline';
  metrics: {
    name: string;
    titleId: string;
    order: number;
    color: string;
    valueType: WidgetValueType;
  }[];
};

export type DataBarWidget = BaseWidgetDefinition & {
  type: 'data-bar';
  metrics: {
    name: string;
    titleId: string;
    order: number;
    valueType: WidgetValueType;
  }[];
};

export type CountdownWidget = BaseWidgetDefinition & {
  type: 'countdown';
  metricName: string;
};

export type HealthStatusWidget = BaseWidgetDefinition & {
  type: 'health-status';
};

export type ProgressCircleWidget = BaseWidgetDefinition & {
  type: 'progress-circle';
  valueType: WidgetValueType;
  maxMetricName: string;
  currentMetricName: string;
  titleId: string;
  color: string;
  colorThresholds: {
    value: number;
    color: string;
  }[];
};

export type PercentCircleWidget = BaseWidgetDefinition & {
  type: 'percent-circle';
  metricName: string;
  titleId: string;
  color: string;
  colorThresholds: {
    value: number;
    color: string;
  }[];
};

export type Widget =
  | StackedTimelineWidget
  | DataBarWidget
  | CountdownWidget
  | HealthStatusWidget
  | ProgressCircleWidget
  | PercentCircleWidget;

export type WidgetValueType =
  | 'number'
  | 'percent'
  | 'string'
  | 'boolean'
  | 'object'
  | 'array'
  | 'null'
  | 'undefined'
  | 'bytes'
  | 'seconds';
