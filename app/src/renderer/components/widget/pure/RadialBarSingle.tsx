import React, { FunctionComponent, useMemo } from 'react';
import merge from 'lodash/merge';
import { lighten, styled } from '@mui/material/styles';
import ReactApexChart from 'react-apexcharts';
import BaseOptionChart from 'renderer/components/chart/BaseOptionChart';
import { ApexOptions } from 'apexcharts';

const CHART_HEIGHT = 300;

const ChartWrapperStyle = styled('div')(({ theme }) => ({
  height: CHART_HEIGHT,
  marginTop: theme.spacing(2),
  '& .apexcharts-canvas svg': { height: CHART_HEIGHT },
  '& .apexcharts-canvas svg,.apexcharts-canvas foreignObject': {
    overflow: 'visible',
  },
}));

type RadialBarSingleProps = {
  title: string;
  color: string;
  percent: number;
};

const RadialBarSingle: FunctionComponent<RadialBarSingleProps> = ({ title, color, percent }) => {
  const chartData = useMemo<
    {
      label: string;
      value: number;
    }[]
  >(() => [{ label: title, value: percent }], [title, percent]);
  const chartColors = useMemo<string[]>(() => [lighten(color, 0.5), color], [color]);
  const chartLabels = useMemo<string[]>(() => chartData.map((i) => i.label), [chartData]);
  const chartSeries = useMemo<number[]>(() => chartData.map((i) => i.value), [chartData]);

  const overrideOptions = useMemo<Partial<ApexOptions>>(
    () => ({
      labels: chartLabels,
      legend: { show: false },
      fill: {
        type: 'gradient',
        gradient: {
          colorStops: chartColors.map((c) => [{ offset: 0, color: c }]),
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
              label: title,
            },
          },
        },
      },
    }),
    [chartLabels, chartColors, title, percent]
  );

  const chartOptions: ApexOptions = merge(BaseOptionChart(), overrideOptions);

  return (
    <ChartWrapperStyle dir="ltr">
      <ReactApexChart type="radialBar" series={chartSeries} options={chartOptions} height={'100%'} />
    </ChartWrapperStyle>
  );
};
export default RadialBarSingle;
