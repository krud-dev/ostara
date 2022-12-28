import React, { FunctionComponent, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { StackedTimelineWidget } from 'infra/dashboard/model';
import { DashboardWidgetCardProps } from 'renderer/components/widget/widget';
import DashboardGenericCard from 'renderer/components/widget/card/DashboardGenericCard';
import merge from 'lodash/merge';
import { styled } from '@mui/material/styles';
import ReactApexChart from 'react-apexcharts';
import BaseOptionChart from 'renderer/components/chart/BaseOptionChart';
import { ApexOptions } from 'apexcharts';
import { useGetLatestMetric } from 'renderer/apis/metrics/getLatestMetric';
import { useSubscribeToMetric } from 'renderer/apis/metrics/subscribeToMetric';
import { every, isEmpty, takeRight } from 'lodash';
import { ApplicationMetricDTO } from 'infra/metrics/metricsService';
import { useIntl } from 'react-intl';

const CHART_HEIGHT = 364;
const MAX_DATA_POINTS = 50;
const MIN_SECONDS_BETWEEN_DATA_POINTS = 5;

const ChartWrapperStyle = styled('div')(({ theme }) => ({
  height: CHART_HEIGHT,
  marginTop: theme.spacing(2),
  '& .apexcharts-canvas svg': { height: CHART_HEIGHT },
  '& .apexcharts-canvas svg,.apexcharts-canvas foreignObject': {
    overflow: 'visible',
  },
  padding: theme.spacing(0, 2),
}));

const StackedTimelineDashboardWidget: FunctionComponent<DashboardWidgetCardProps<StackedTimelineWidget>> = ({
  widget,
  item,
}) => {
  const intl = useIntl();

  const [data, setData] = useState<{ name: string; data: number[] }[]>(
    widget.metrics.map((metric) => ({ name: metric.title, data: [] }))
  );
  const [chartLabels, setChartLabels] = useState<string[]>([]);

  const dataPoint = useRef<number[]>([]);
  const lastDataPointTime = useRef<number>(0);

  const isLoading = useMemo<boolean>(() => isEmpty(chartLabels), [chartLabels]);

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

        const initialDataPoint = results.map((result) => result.values[0].value);
        addDataPoint(initialDataPoint);
      } catch (e) {}
    })();
  }, []);

  useEffect(() => {
    let unsubscribes: (() => void)[];
    (async () => {
      try {
        unsubscribes = await Promise.all(
          widget.metrics.map(
            async (metric, index): Promise<() => void> =>
              await subscribeToMetricState.mutateAsync({
                instanceId: item.id,
                metricName: metric.name,
                listener: (event, value) => {
                  dataPoint.current[index] = value.values[0].value;
                  if (
                    dataPoint.current.length === widget.metrics.length &&
                    every(dataPoint.current, (v) => v !== undefined)
                  ) {
                    addDataPoint(dataPoint.current);
                    dataPoint.current = [];
                  }
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

  const addDataPoint = useCallback((dataPointToAdd: number[]): void => {
    const now = Date.now();
    if (now - lastDataPointTime.current < MIN_SECONDS_BETWEEN_DATA_POINTS * 1000) {
      return;
    }
    lastDataPointTime.current = now;

    setData((prev) =>
      prev.map((series, index) => ({
        ...series,
        data: takeRight([...series.data, dataPointToAdd[index]], MAX_DATA_POINTS),
      }))
    );
    setChartLabels((prev) => takeRight([...prev, intl.formatTime(now, { timeStyle: 'medium' })], MAX_DATA_POINTS));
  }, []);

  const chartColors = useMemo<string[]>(() => widget.metrics.map((m) => m.color), [widget]);

  const overrideOptions = useMemo<Partial<ApexOptions>>(
    () => ({
      chart: {
        stacked: true,
      },
      legend: { position: 'top', horizontalAlign: 'right' },
      xaxis: {
        categories: chartLabels,
      },
      colors: chartColors,
    }),
    [chartLabels, chartColors]
  );

  const chartOptions: ApexOptions = merge(BaseOptionChart(), overrideOptions);

  return (
    <DashboardGenericCard title={widget.title} loading={isLoading}>
      <ChartWrapperStyle dir="ltr">
        <ReactApexChart type="area" series={data} options={chartOptions} height={'100%'} width={'100%'} />
      </ChartWrapperStyle>
    </DashboardGenericCard>
  );
};
export default StackedTimelineDashboardWidget;
