import React, { useCallback, useMemo } from 'react';
import { MetricActuatorResponse } from '../../../../../../common/generated_definitions';
import { useTheme } from '@mui/material/styles';
import { StackedTimelineWidget } from '../../../../../components/widget/widget';
import DashboardWidget from '../../../../../components/widget/DashboardWidget';
import { useNavigatorTree } from '../../../../../contexts/NavigatorTreeContext';
import { ItemRO } from '../../../../../definitions/daemon';
import { useIntl } from 'react-intl';

type MetricTimelineProps = {
  metricDetails: MetricActuatorResponse;
};

export default function MetricTimeline({ metricDetails }: MetricTimelineProps) {
  const theme = useTheme();
  const intl = useIntl();
  const { selectedItem } = useNavigatorTree();

  const item = useMemo<ItemRO>(() => selectedItem as ItemRO, [selectedItem]);

  const getMeasurementColor = useCallback(
    (index: number): string => {
      switch (index) {
        case 0:
          return theme.palette.primary.main;
        case 1:
          return theme.palette.warning.main;
        case 2:
          return theme.palette.info.main;
        default:
          return theme.palette.fatal.main;
      }
    },
    [theme]
  );

  const widget = useMemo<StackedTimelineWidget>(
    () => ({
      id: 'metricTimeline',
      type: 'stacked-timeline',
      title: intl.formatMessage({ id: 'timeline' }),
      metrics: metricDetails.measurements.map((measurement, index) => ({
        name: `${metricDetails.name}[${measurement.statistic}]`,
        title: `${metricDetails.name} - ${measurement.statistic}`,
        order: 0,
        color: getMeasurementColor(index),
        valueType: 'number',
      })),
    }),
    [metricDetails, getMeasurementColor]
  );

  return <DashboardWidget widget={widget} item={item} variant={'outlined'} />;
}
