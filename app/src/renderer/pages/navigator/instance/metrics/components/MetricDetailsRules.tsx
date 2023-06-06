import React, { useMemo } from 'react';
import { Card } from '@mui/material';
import { InstanceRO, MetricActuatorResponse } from '../../../../../../common/generated_definitions';
import { useNavigatorTree } from '../../../../../contexts/NavigatorTreeContext';
import ApplicationMetricRulesTable from '../../../application/metric-rules/components/ApplicationMetricRulesTable';

type MetricDetailsRulesProps = {
  metricDetails: MetricActuatorResponse;
};

export default function MetricDetailsRules({ metricDetails }: MetricDetailsRulesProps) {
  const { selectedItem } = useNavigatorTree();

  const item = useMemo<InstanceRO>(() => selectedItem as InstanceRO, [selectedItem]);

  return (
    <Card variant={'outlined'}>
      <ApplicationMetricRulesTable applicationId={item.parentApplicationId} metricName={metricDetails.name} />
    </Card>
  );
}
