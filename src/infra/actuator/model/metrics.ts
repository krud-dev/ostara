export type ActuatorMetric = {
  name: string;
  description?: string;
  baseUnit?: string;
  measurements: {
    statistic: string;
    value: number;
  }[];
  availableTags: {
    tag: string;
    values: string[];
  }[];
};

export type ActuatorMetricsResponse = {
  names: string[];
};

export type ActuatorMetricResponse = ActuatorMetric;
