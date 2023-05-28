import { ParsedMetricName } from '../../common/generated_definitions';
import { isEmpty, map } from 'lodash';

export const getStringMetricName = (metric: ParsedMetricName): string => {
  return `${metric.name}[${metric.statistic}]${
    metric.tags && !isEmpty(metric.tags) ? `?${map(metric.tags, (value, key) => `${key}=${value}`).join('&')}` : ''
  }`;
};
