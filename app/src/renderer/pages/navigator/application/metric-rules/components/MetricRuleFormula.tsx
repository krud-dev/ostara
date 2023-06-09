import React, { FunctionComponent, ReactNode, useMemo } from 'react';
import { Box, Tooltip } from '@mui/material';
import { ApplicationMetricRuleCreateRequestRO, ApplicationMetricRuleRO } from 'common/generated_definitions';
import { MetricRuleFormValues } from 'renderer/pages/navigator/application/metric-rules/components/MetricRuleDetailsForm';
import { getMetricRuleFormValues, isMetricRuleFormValues } from 'renderer/utils/metricUtils';

type MetricRuleFormulaProps = {
  metricRule: ApplicationMetricRuleRO | ApplicationMetricRuleCreateRequestRO | MetricRuleFormValues;
};

const MetricRuleFormula: FunctionComponent<MetricRuleFormulaProps> = ({ metricRule }) => {
  const formValues = useMemo<MetricRuleFormValues>(
    () => (isMetricRuleFormValues(metricRule) ? metricRule : getMetricRuleFormValues(metricRule)),
    [metricRule]
  );

  const variable = useMemo<ReactNode>(
    () => (
      <>
        <MetricRuleFormulaMetric
          name={formValues.metricName}
          statistic={formValues.metricStatistic}
          tags={formValues.metricTags}
        />
        {formValues.type === 'RELATIVE' && (
          <>
            {' / '}
            <MetricRuleFormulaMetric
              name={formValues.divisorMetricName}
              statistic={formValues.divisorMetricStatistic}
              tags={formValues.divisorMetricTags}
            />
          </>
        )}
      </>
    ),
    [formValues]
  );

  const formula = useMemo<ReactNode>(() => {
    switch (formValues.operation) {
      case 'GREATER_THAN':
        return (
          <>
            {variable}
            {' > '}
            <MetricRuleFormulaValue value={formValues.value1} />
          </>
        );
      case 'LOWER_THAN':
        return (
          <>
            {variable}
            {' < '}
            <MetricRuleFormulaValue value={formValues.value1} />
          </>
        );
      case 'BETWEEN':
        return (
          <>
            <MetricRuleFormulaValue value={formValues.value1} />
            {' < '}
            {variable}
            {' < '}
            <MetricRuleFormulaValue value={formValues.value2} />
          </>
        );
      default:
        return variable;
    }
  }, [formValues]);

  return <Box component={'span'}>{formula}</Box>;
};

export default MetricRuleFormula;

type MetricRuleFormulaMetricProps = {
  name: string;
  statistic: string;
  tags: string[];
};

const MetricRuleFormulaMetric: FunctionComponent<MetricRuleFormulaMetricProps> = ({ name, statistic, tags }) => {
  const showTags = useMemo<boolean>(() => !!tags.length, [tags]);
  return (
    <Box component={'span'}>
      {name ? (
        <>
          {name}
          <Box component={'span'} sx={{ color: 'info.light' }}>
            [{statistic}]
          </Box>
          {showTags && (
            <Tooltip title={tags.join(', ')}>
              <Box component={'span'} sx={{ color: 'success.light' }}>
                ?Tags
              </Box>
            </Tooltip>
          )}
        </>
      ) : (
        '?'
      )}
    </Box>
  );
};

type MetricRuleFormulaValueProps = {
  value: string;
};

const MetricRuleFormulaValue: FunctionComponent<MetricRuleFormulaValueProps> = ({ value }) => {
  return (
    <Box component={'span'} sx={{ color: 'error.light', fontWeight: 'bold' }}>
      {value || '?'}
    </Box>
  );
};
