import React, { FunctionComponent, useCallback, useMemo, useState } from 'react';
import { ProgressCircleWidget } from 'infra/dashboard/model';
import { DashboardWidgetCardProps } from 'renderer/components/widget/widget';
import DashboardGenericCard from 'renderer/components/widget/card/DashboardGenericCard';
import merge from 'lodash/merge';
import { lighten, styled } from '@mui/material/styles';
import ReactApexChart from 'react-apexcharts';
import BaseOptionChart from 'renderer/components/chart/BaseOptionChart';
import { ApexOptions } from 'apexcharts';
import { ApplicationMetricDTO } from 'infra/metrics/metricsService';
import useWidgetSubscribeToMetrics from 'renderer/components/widget/hooks/useWidgetSubscribeToMetrics';

const CHART_HEIGHT = 300;

const ChartWrapperStyle = styled('div')(({ theme }) => ({
  height: CHART_HEIGHT,
  marginTop: theme.spacing(2),
  '& .apexcharts-canvas svg': { height: CHART_HEIGHT },
  '& .apexcharts-canvas svg,.apexcharts-canvas foreignObject': {
    overflow: 'visible',
  },
}));

const ProgressCircleDashboardWidget: FunctionComponent<DashboardWidgetCardProps<ProgressCircleWidget>> = ({
  widget,
  item,
}) => {
  const [data, setData] = useState<{ current?: number; max?: number }>({ current: undefined, max: undefined });
  const loading = useMemo<boolean>(() => data.current === undefined || data.max === undefined, [data]);
  const empty = useMemo<boolean>(
    () => !loading && (data.current === undefined || data.max === undefined),
    [loading, data]
  );
  const currentPercent = useMemo<number>(
    () => Math.round(((data.current ?? 0) / (data.max ?? 1)) * 10000) / 100,
    [data]
  );

  const onMetricUpdate = useCallback(
    (metricDto?: ApplicationMetricDTO): void => {
      if (!metricDto) {
        return;
      }
      if (metricDto.name === widget.currentMetricName) {
        setData((prev) => ({ ...prev, current: metricDto.values[0].value }));
      } else {
        setData((prev) => ({ ...prev, max: metricDto.values[0].value }));
      }
    },
    [widget, setData]
  );

  const metricNames = useMemo<string[]>(() => [widget.maxMetricName, widget.currentMetricName], [widget]);

  useWidgetSubscribeToMetrics(item.id, metricNames, onMetricUpdate);

  const chartData = useMemo<
    {
      label: string;
      value: number;
    }[]
  >(() => [{ label: widget.title, value: currentPercent }], [widget, currentPercent]);
  const chartColors = useMemo<string[][]>(() => [[lighten(widget.color, 0.5), widget.color]], [widget]);
  const chartLabels = useMemo<string[]>(() => chartData.map((i) => i.label), [chartData]);
  const chartSeries = useMemo<number[]>(() => chartData.map((i) => i.value), [chartData]);

  const overrideOptions = useMemo<Partial<ApexOptions>>(
    () => ({
      labels: chartLabels,
      legend: { show: false },
      fill: {
        type: 'gradient',
        gradient: {
          colorStops: chartColors.map((colors) => [{ offset: 0, color: colors[0] }]),
        },
      },
      plotOptions: {
        radialBar: {
          hollow: { size: '68%' },
          dataLabels: {
            name: {
              offsetY: -16,
            },
            value: { offsetY: 0 },
            total: {
              label: widget.title,
            },
          },
        },
      },
    }),
    [chartLabels, chartColors, widget, currentPercent]
  );

  const chartOptions: ApexOptions = merge(BaseOptionChart(), overrideOptions);

  return (
    <DashboardGenericCard title={widget.title} loading={loading} empty={empty}>
      <ChartWrapperStyle dir="ltr">
        <ReactApexChart type="radialBar" series={chartSeries} options={chartOptions} height={'100%'} />
      </ChartWrapperStyle>
    </DashboardGenericCard>
  );
};
export default ProgressCircleDashboardWidget;
