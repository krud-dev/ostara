import React, { FunctionComponent, useCallback, useMemo, useState } from 'react';
import { DashboardWidgetCardProps, DataBarWidget } from 'renderer/components/widget/widget';
import DashboardGenericCard from 'renderer/components/widget/card/DashboardGenericCard';
import { chain, isNil } from 'lodash';
import { Box, CardContent, Stack, Typography } from '@mui/material';
import HelpIcon from 'renderer/components/help/HelpIcon';
import MetricValue from 'renderer/components/widget/metric/MetricValue';
import useWidgetSubscribeToMetrics from 'renderer/components/widget/hooks/useWidgetSubscribeToMetrics';
import { InstanceMetricRO } from '../../../../common/generated_definitions';
import { EMPTY_STRING } from '../../../constants/ui';

const DataBarDashboardWidget: FunctionComponent<DashboardWidgetCardProps<DataBarWidget>> = ({
  widget,
  item,
  variant,
  sx,
}) => {
  const [data, setData] = useState<{ [key: string]: InstanceMetricRO }>({});
  const loading = useMemo<boolean>(() => Object.keys(data).length < widget.metrics.length, [data]);
  const empty = useMemo<boolean>(() => !loading && Object.keys(data).length < widget.metrics.length, [loading, data]);

  const onMetricUpdate = useCallback(
    (metricDto?: InstanceMetricRO): void => {
      if (!metricDto) {
        return;
      }
      setData((prev) => ({ ...prev, [metricDto.name]: metricDto }));
    },
    [setData]
  );

  const metrics = useMemo(() => chain(widget.metrics).sortBy('order').value(), [widget]);
  const metricNames = useMemo<string[]>(() => metrics.map((metric) => metric.name), [metrics]);

  useWidgetSubscribeToMetrics(item.id, metricNames, onMetricUpdate);

  return (
    <DashboardGenericCard title={widget.title} loading={loading} empty={empty} variant={variant} sx={sx}>
      <CardContent>
        <Stack direction={'row'}>
          {metrics.map((metric, index, array) => {
            const dto = data[metric.name];
            const value = dto?.values[0]?.value;
            const tooltip = dto?.description;
            return (
              <Box sx={{ width: `${100 / array.length}%`, textAlign: 'center' }} key={metric.name}>
                <Typography variant={'h3'} sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {!isNil(value) ? <MetricValue value={value} valueType={metric.valueType} /> : EMPTY_STRING}
                </Typography>
                <Typography
                  variant={'subtitle2'}
                  sx={{ color: 'text.secondary', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  {metric.title}
                  <HelpIcon title={tooltip} sx={{ ml: 0.5 }} />
                </Typography>
              </Box>
            );
          })}
        </Stack>
      </CardContent>
    </DashboardGenericCard>
  );
};
export default DataBarDashboardWidget;
