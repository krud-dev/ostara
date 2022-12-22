export type BaseWidgetDefinition = {
  type: string;
  title: string;
  description: string;
};

export type StackedTimelineWidget = BaseWidgetDefinition & {
  type: 'stacked-timeline';
  metrics: {
    name: string;
    title: string;
    sort: number;
    color: string;
  }[];
};

export type DataBarWidget = BaseWidgetDefinition & {
  type: 'data-bar';
  metrics: {
    name: string;
    title: string;
    sort: number;
  }[];
};

export type ProgressCircleWidget = BaseWidgetDefinition & {
  type: 'progress-circle';
  maxMetricName: string;
  currentMetricName: string;
  title: string;
  color: string;
};

export type Widget = StackedTimelineWidget | DataBarWidget | ProgressCircleWidget;
