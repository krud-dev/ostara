import {
  ApplicationMetricRuleCreateRequestRO,
  ApplicationMetricRuleRO,
  ParsedMetricName,
} from '../../common/generated_definitions';
import { isEmpty, map } from 'lodash';
import { MetricRuleFormValues } from '../pages/navigator/application/metric-rules/components/MetricRuleDetailsForm';

export const getStringMetricName = (metric: ParsedMetricName): string => {
  return `${metric.name}[${metric.statistic}]${
    metric.tags && !isEmpty(metric.tags) ? `?${map(metric.tags, (value, key) => `${key}=${value}`).join('&')}` : ''
  }`;
};

export const getMetricRuleFormValues = (
  metricRule: ApplicationMetricRuleRO | ApplicationMetricRuleCreateRequestRO
): MetricRuleFormValues => ({
  name: metricRule.name,
  type: metricRule.type,
  metricName: metricRule.metricName.name,
  metricStatistic: metricRule.metricName.statistic,
  metricTags: map(metricRule.metricName.tags, (value, key) => `${key}=${value}`),
  divisorMetricName: metricRule.divisorMetricName?.name || '',
  divisorMetricStatistic: metricRule.divisorMetricName?.statistic || '',
  divisorMetricTags: map(metricRule.divisorMetricName?.tags, (value, key) => `${key}=${value}`),
  operation: metricRule.operation || 'GREATER_THAN',
  enabled: metricRule.enabled,
  value1: metricRule.value1.toString(),
  value2: metricRule.value2?.toString() || '',
});

const getMetricFullName = (metricName: string, metricStatistic: string, metricTags: string[]): string => {
  if (!metricName) {
    return '?';
  }
  return `${metricName}${metricStatistic ? `[${metricStatistic}]` : ''}${
    metricTags && !isEmpty(metricTags) ? `?${metricTags.join('&')}` : ''
  }`;
};

export const getMetricRuleFormValuesFormula = (formValues: MetricRuleFormValues): string => {
  const {
    type,
    metricName,
    metricStatistic,
    metricTags,
    divisorMetricName,
    divisorMetricStatistic,
    divisorMetricTags,
    operation,
    value1,
    value2,
  } = formValues;

  let variable = getMetricFullName(metricName, metricStatistic, metricTags);

  if (type === 'RELATIVE') {
    variable += ` / ${getMetricFullName(divisorMetricName, divisorMetricStatistic, divisorMetricTags)}`;
  }

  switch (operation) {
    case 'GREATER_THAN':
      return `${variable} > ${value1 || '?'}`;
    case 'LOWER_THAN':
      return `${variable} < ${value1 || '?'}`;
    case 'BETWEEN':
      return `${value1 || '?'} < ${variable} < ${value2 || '?'}`;
    default:
      return variable;
  }
};
