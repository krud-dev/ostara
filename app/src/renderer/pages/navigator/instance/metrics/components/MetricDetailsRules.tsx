import React, { useMemo } from 'react';
import { Card } from '@mui/material';
import { InstanceRO, MetricActuatorResponse } from 'common/generated_definitions';
import ApplicationMetricRulesTable from 'renderer/pages/navigator/application/metric-rules/components/ApplicationMetricRulesTable';
import { useNavigatorLayout } from 'renderer/contexts/NavigatorLayoutContext';

type MetricDetailsRulesProps = {
  metricDetails: MetricActuatorResponse;
};

export default function MetricDetailsRules({ metricDetails }: MetricDetailsRulesProps) {
  const { selectedItem } = useNavigatorLayout();

  const item = useMemo<InstanceRO>(() => selectedItem as InstanceRO, [selectedItem]);

  return (
    <Card variant={'outlined'}>
      <ApplicationMetricRulesTable applicationId={item.parentApplicationId} metricName={metricDetails.name} />
    </Card>
  );
}
