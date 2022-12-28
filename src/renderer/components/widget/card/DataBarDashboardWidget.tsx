import React, { FunctionComponent, useEffect, useMemo, useState } from 'react';
import { DataBarWidget } from 'infra/dashboard/model';
import { DashboardWidgetCardProps } from 'renderer/components/widget/widget';
import DashboardGenericCard from 'renderer/components/widget/card/DashboardGenericCard';
import { useGetLatestMetric } from 'renderer/apis/metrics/getLatestMetric';
import { useSubscribeToMetric } from 'renderer/apis/metrics/subscribeToMetric';
import { chain, isNil } from 'lodash';
import { ApplicationMetricDTO } from 'infra/metrics/metricsService';
import { Box, CardContent, Stack, Typography } from '@mui/material';
import HelpIcon from 'renderer/components/help/HelpIcon';
import MetricValue from 'renderer/components/widget/metric/MetricValue';

const DataBarDashboardWidget: FunctionComponent<DashboardWidgetCardProps<DataBarWidget>> = ({ widget, item }) => {
  const [data, setData] = useState<{ [key: string]: ApplicationMetricDTO }>({});
  const isLoading = useMemo<boolean>(() => Object.keys(data).length < widget.metrics.length, [data]);

  const getMetricState = useGetLatestMetric();
  const subscribeToMetricState = useSubscribeToMetric();

  useEffect(() => {
    (async () => {
      try {
        const results = await Promise.all(
          widget.metrics.map(
            async (metric): Promise<ApplicationMetricDTO> =>
              await getMetricState.mutateAsync({
                instanceId: item.id,
                metricName: metric.name,
              })
          )
        );
        results.forEach((result) => {
          setData((prev) => ({ ...prev, [result.name]: result }));
        });
      } catch (e) {}
    })();
  }, []);

  useEffect(() => {
    let unsubscribes: (() => void)[];
    (async () => {
      try {
        unsubscribes = await Promise.all(
          widget.metrics.map(
            async (metric): Promise<() => void> =>
              await subscribeToMetricState.mutateAsync({
                instanceId: item.id,
                metricName: metric.name,
                listener: (event, result) => {
                  setData((prev) => ({ ...prev, [result.name]: result }));
                },
              })
          )
        );
      } catch (e) {}
    })();
    return () => {
      unsubscribes?.forEach((unsubscribe) => unsubscribe());
    };
  }, [item, widget]);

  const metrics = useMemo<{ name: string; title: string }[]>(
    () =>
      chain(widget.metrics)
        .sortBy('order')
        .map((metric) => ({ name: metric.name, title: metric.title }))
        .value(),
    [widget]
  );

  return (
    <DashboardGenericCard title={widget.title} loading={isLoading}>
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
