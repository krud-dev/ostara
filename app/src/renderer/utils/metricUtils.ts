import { ApplicationMetricRuleCreateRequestRO, ApplicationMetricRuleRO } from 'common/generated_definitions';
import { isArray, isEmpty, map } from 'lodash';
import { MetricRuleFormValues } from 'renderer/pages/navigator/application/metric-rules/components/MetricRuleDetailsForm';

export const getMetricFullName = (
  metric: { name: string; statistic: string; tags: string[] | { [index: string]: string } },
  options?: { hideTags?: boolean }
): string => {
  if (!metric.name) {
    return '?';
  }
  const tags = isArray(metric.tags) ? metric.tags : map(metric.tags, (value, key) => getMetricTagFullName(key, value));
  return `${metric.name}${metric.statistic ? `[${metric.statistic}]` : ''}${
    !isEmpty(tags) ? `?${options?.hideTags ? 'Tags' : tags.join('&')}` : ''
  }`;
};

export const getMetricTagFullName = (key: string, value: string): string => `${key}=${value}`;

export const isMetricRuleFormValues = (
  metricRule: ApplicationMetricRuleRO | ApplicationMetricRuleCreateRequestRO | MetricRuleFormValues
): metricRule is MetricRuleFormValues => {
  return 'metricStatistic' in metricRule;
};

export const getMetricRuleFormValues = (
  metricRule: ApplicationMetricRuleRO | ApplicationMetricRuleCreateRequestRO
): MetricRuleFormValues => ({
  name: metricRule.name,
  type: metricRule.type,
  metricName: metricRule.metricName.name,
  metricStatistic: metricRule.metricName.statistic,
  metricTags: map(metricRule.metricName.tags, (value, key) => getMetricTagFullName(key, value)),
  divisorMetricName: metricRule.divisorMetricName?.name || '',
  divisorMetricStatistic: metricRule.divisorMetricName?.statistic || '',
  divisorMetricTags: map(metricRule.divisorMetricName?.tags, (value, key) => getMetricTagFullName(key, value)),
  operation: metricRule.operation || 'GREATER_THAN',
  enabled: metricRule.enabled,
  value1: metricRule.value1.toString(),
  value2: metricRule.value2?.toString() || '',
});

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

  let variable = getMetricFullName({ name: metricName, statistic: metricStatistic, tags: metricTags });

  if (type === 'RELATIVE') {
    variable += ` / ${getMetricFullName({
      name: divisorMetricName,
      statistic: divisorMetricStatistic,
      tags: divisorMetricTags,
    })}`;
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
