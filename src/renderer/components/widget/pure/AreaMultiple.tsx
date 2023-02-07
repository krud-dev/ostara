import React, { FunctionComponent, useMemo } from 'react';
import merge from 'lodash/merge';
import { styled } from '@mui/material/styles';
import ReactApexChart from 'react-apexcharts';
import BaseOptionChart from 'renderer/components/chart/BaseOptionChart';
import { ApexOptions } from 'apexcharts';

const CHART_HEIGHT = 364;

const ChartWrapperStyle = styled('div')(({ theme }) => ({
  height: CHART_HEIGHT,
  marginTop: theme.spacing(2),
  '& .apexcharts-canvas svg': { height: CHART_HEIGHT },
  '& .apexcharts-canvas svg,.apexcharts-canvas foreignObject': {
    overflow: 'visible',
  },
  padding: theme.spacing(0, 2),
}));

type AreaMultipleProps = {
  series: { name: string; data: number[] }[];
  labels: string[];
  colors: string[];
  tickAmount?: number;
};

const AreaMultiple: FunctionComponent<AreaMultipleProps> = ({ series, labels, colors, tickAmount }) => {
  const overrideOptions = useMemo<Partial<ApexOptions>>(
    () => ({
      chart: {
        stacked: true,
      },
      legend: { position: 'top', horizontalAlign: 'right' },
      xaxis: {
        categories: labels,
        tickAmount: tickAmount,
      },
      colors: colors,
    }),
    [labels, colors]
  );

  const chartOptions: ApexOptions = merge(BaseOptionChart(), overrideOptions);

  return (
    <ChartWrapperStyle dir="ltr">
      <ReactApexChart type="area" series={series} options={chartOptions} height={'100%'} width={'100%'} />
    </ChartWrapperStyle>
  );
};
export default AreaMultiple;
