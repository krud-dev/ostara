import React, { FunctionComponent, useCallback, useMemo, useState } from 'react';
import { DataBarWidget } from 'infra/dashboard/model';
import { DashboardWidgetCardProps } from 'renderer/components/widget/widget';
import DashboardGenericCard from 'renderer/components/widget/card/DashboardGenericCard';
import { chain, isNil } from 'lodash';
import { ApplicationMetricDTO } from 'infra/metrics/metricsService';
import { Box, CardContent, Stack, Typography } from '@mui/material';
import HelpIcon from 'renderer/components/help/HelpIcon';
import MetricValue from 'renderer/components/widget/metric/MetricValue';
import useWidgetSubscribeToMetrics from 'renderer/components/widget/hooks/useWidgetSubscribeToMetrics';
import useWidgetLatestMetrics from 'renderer/components/widget/hooks/useWidgetLatestMetrics';

const DataBarDashboardWidget: FunctionComponent<DashboardWidgetCardProps<DataBarWidget>> = ({ widget, item }) => {
  const [data, setData] = useState<{ [key: string]: ApplicationMetricDTO }>({});
  const [loading, setLoading] = useState<boolean>(true);
  const empty = useMemo<boolean>(() => !loading && Object.keys(data).length < widget.metrics.length, [loading, data]);

  const onMetricUpdate = useCallback(
    (metricDto?: ApplicationMetricDTO): void => {
      if (!metricDto) {
        return;
      }
      setData((prev) => ({ ...prev, [metricDto.name]: metricDto }));
    },
    [setData]
  );

  const metrics = useMemo<{ name: string; title: string }[]>(
    () =>
      chain(widget.metrics)
        .sortBy('order')
        .map((metric) => ({ name: metric.name, title: metric.title }))
        .value(),
    [widget]
  );

  const metricNames = useMemo<string[]>(() => metrics.map((metric) => metric.name), [metrics]);

  useWidgetLatestMetrics(item.id, metricNames, (metricDtos) => {
    metricDtos.forEach(onMetricUpdate);
    setLoading(false);
  });
  useWidgetSubscribeToMetrics(item.id, metricNames, onMetricUpdate, { active: !loading });

  return (
    <DashboardGenericCard title={widget.title} loading={loading} empty={empty}>
      <CardContent>
        <Stack direction={'row'}>
          {metrics.map((metric, index, array) => {
            const dto = data[metric.name];
            const value = dto?.values[0]?.value;
            const unit = dto?.unit;
            const tooltip = dto?.description;
            return (
              <Box sx={{ width: `${100 / array.length}%`, textAlign: 'center' }} key={metric.name}>
                <Typography variant={'h3'} sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {!isNil(value) ? <MetricValue value={value} unit={unit} /> : '\u00A0'}
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
