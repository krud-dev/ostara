import merge from 'lodash/merge';
import ReactApexChart from 'react-apexcharts';
import { useTheme, styled } from '@mui/material/styles';
import BaseOptionChart from 'renderer/components/chart/BaseOptionChart';
import { useMemo } from 'react';
import { ApexOptions } from 'apexcharts';
import { roundNumber } from 'renderer/utils/formatUtils';

const CHART_HEIGHT = 200;
const LEGEND_HEIGHT = 50;

const ChartWrapperStyle = styled('div')(({ theme }) => ({
  height: CHART_HEIGHT,
  '& .apexcharts-canvas': { margin: '0 auto' },
  '& .apexcharts-canvas svg': { height: CHART_HEIGHT },
  '& .apexcharts-canvas svg,.apexcharts-canvas foreignObject': {
    overflow: 'visible',
  },
  '& .apexcharts-legend': {
    height: LEGEND_HEIGHT,
    alignContent: 'center',
    position: 'relative !important' as 'relative',
    top: `calc(${CHART_HEIGHT - LEGEND_HEIGHT}px) !important`,
  },
}));

interface DonutMultipleProps {
  data: {
    label: string;
    value: number;
  }[];
  colors?: string[];
  round?: number;
}

export default function DonutMultiple({ data, colors, round = 2 }: DonutMultipleProps) {
  const theme = useTheme();

  const chartLabels = useMemo<string[]>(() => data.map((i) => i.label), [data]);
  const chartSeries = useMemo<number[]>(() => data.map((i) => i.value), [data]);

  const overrideOptions = useMemo<Partial<ApexOptions>>(
    () => ({
      colors: colors,
      labels: chartLabels,
      stroke: { colors: [theme.palette.background.paper] },
      legend: { floating: true, horizontalAlign: 'center' },
      tooltip: {
        fillSeriesColor: false,
        y: {
          formatter: (val: number, opts?: any): string => roundNumber(val, round).toString(),
          title: {
            formatter: (seriesName: string) => `${seriesName}`,
          },
        },
      },
      plotOptions: {
        pie: {
          donut: {
            size: '90%',
            labels: {
              value: {
                offsetY: 0,
                formatter: (val: string): string => roundNumber(parseFloat(val), round).toString(),
              },
              total: {
                formatter: (w: { globals: { seriesTotals: number[] } }): string => {
                  const sum = w.globals.seriesTotals.reduce((a, b) => a + b, 0);
                  return roundNumber(sum, round).toString();
                },
              },
            },
          },
        },
      },
    }),
    [chartLabels, colors]
  );

  const chartOptions: ApexOptions = merge(BaseOptionChart(), overrideOptions);

  return (
    <ChartWrapperStyle dir="ltr">
      <ReactApexChart
        type="donut"
        series={chartSeries}
        options={chartOptions}
        width={CHART_HEIGHT}
        height={CHART_HEIGHT - LEGEND_HEIGHT + 30}
      />
    </ChartWrapperStyle>
  );
}
