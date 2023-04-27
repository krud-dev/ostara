import { ItemRO } from '../../definitions/daemon';
import { SxProps } from '@mui/system';
import { Theme } from '@mui/material/styles';

export interface DashboardWidgetCardProps<W extends Widget> {
  widget: W;
  item: ItemRO;
  variant?: 'outlined' | 'elevation';
  sx?: SxProps<Theme>;
}

export type BaseWidgetDefinition = {
  id: string;
  type: string;
  title: string;
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
  title: string;
  color: string;
  colorThresholds: {
    value: number;
    color: string;
  }[];
};

export type PercentCircleWidget = BaseWidgetDefinition & {
  type: 'percent-circle';
  metricName: string;
  title: string;
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
