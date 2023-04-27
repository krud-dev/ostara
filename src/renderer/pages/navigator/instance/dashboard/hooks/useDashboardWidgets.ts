import { useCallback, useMemo } from 'react';
import {
  CountdownWidget,
  DataBarWidget,
  HealthStatusWidget,
  PercentCircleWidget,
  ProgressCircleWidget,
  StackedTimelineWidget,
  Widget,
} from '../../../../../components/widget/widget';
import { useTheme } from '@mui/material/styles';
import { useIntl } from 'react-intl';

const useDashboardWidgets = () => {
  const theme = useTheme();
  const intl = useIntl();

  const asWidgets = useCallback(<T extends { [key: string]: Widget }>(arg: T): T => {
    return arg;
  }, []);

  return useMemo(
    () =>
      asWidgets({
        processWidget: <DataBarWidget>{
          id: 'processWidget',
          type: 'data-bar',
          title: intl.formatMessage({ id: 'process' }),
          metrics: [
            {
              name: 'process.uptime[VALUE]',
              title: intl.formatMessage({ id: 'uptime' }),
              order: 0,
              valueType: 'seconds',
            },
            {
              name: 'process.cpu.usage[VALUE]',
              title: intl.formatMessage({ id: 'cpuUsage' }),
              order: 1,
              valueType: 'percent',
            },
            {
              name: 'system.cpu.count[VALUE]',
              title: intl.formatMessage({ id: 'cpuCount' }),
              order: 2,
              valueType: 'number',
            },
          ],
        },
        uptimeWidget: <CountdownWidget>{
          id: 'uptimeWidget',
          type: 'countdown',
          title: intl.formatMessage({ id: 'uptime' }),
          metricName: 'process.uptime[VALUE]',
        },
        healthStatusWidget: <HealthStatusWidget>{
          id: 'healthStatusWidget',
          type: 'health-status',
          title: intl.formatMessage({ id: 'status' }),
        },
        threadCount: <StackedTimelineWidget>{
          id: 'threadCount',
          type: 'stacked-timeline',
          title: intl.formatMessage({ id: 'threadCount' }),
          metrics: [
            {
              name: 'jvm.threads.live[VALUE]',
              title: intl.formatMessage({ id: 'liveThreadCount' }),
              order: 0,
              color: theme.palette.primary.main,
              valueType: 'number',
            },
            {
              name: 'jvm.threads.daemon[VALUE]',
              title: intl.formatMessage({ id: 'daemonThreadCount' }),
              order: 1,
              color: theme.palette.warning.main,
              valueType: 'number',
            },
          ],
        },
        memoryUsageTimeline: <StackedTimelineWidget>{
          id: 'memoryUsageTimeline',
          type: 'stacked-timeline',
          title: intl.formatMessage({ id: 'memoryUsageMb' }),
          metrics: [
            {
              name: 'jvm.memory.used[VALUE]',
              title: intl.formatMessage({ id: 'memoryUsedMb' }),
              order: 0,
              color: theme.palette.primary.main,
              valueType: 'bytes',
            },
            {
              name: 'jvm.memory.committed[VALUE]',
              title: intl.formatMessage({ id: 'memoryCommittedMb' }),
              order: 1,
              color: theme.palette.warning.main,
              valueType: 'bytes',
            },
          ],
        },
        memoryUsageCircle: <ProgressCircleWidget>{
          id: 'memoryUsageCircle',
          type: 'progress-circle',
          title: intl.formatMessage({ id: 'memoryUsage' }),
          valueType: 'number',
          maxMetricName: 'jvm.memory.max[VALUE]',
          currentMetricName: 'jvm.memory.used[VALUE]',
          color: theme.palette.success.main,
          colorThresholds: [
            {
              value: 0,
              color: theme.palette.success.main,
            },
            {
              value: 70,
              color: theme.palette.warning.main,
            },
            {
              value: 90,
              color: theme.palette.error.main,
            },
          ],
        },
        diskUsageCircle: <ProgressCircleWidget>{
          id: 'diskUsageCircle',
          type: 'progress-circle',
          title: intl.formatMessage({ id: 'diskUsage' }),
          valueType: 'number',
          maxMetricName: 'disk.total[VALUE]',
          currentMetricName: 'disk.free[VALUE]',
          color: theme.palette.success.main,
          colorThresholds: [
            {
              value: 0,
              color: theme.palette.success.main,
            },
            {
              value: 70,
              color: theme.palette.warning.main,
            },
            {
              value: 90,
              color: theme.palette.error.main,
            },
          ],
        },
        cpuUsageCircle: <PercentCircleWidget>{
          id: 'cpuUsageCircle',
          type: 'percent-circle',
          title: intl.formatMessage({ id: 'cpuUsage' }),
          metricName: 'process.cpu.usage[VALUE]',
          color: theme.palette.success.main,
          colorThresholds: [
            {
              value: 0,
              color: theme.palette.success.main,
            },
            {
              value: 70,
              color: theme.palette.warning.main,
            },
            {
              value: 90,
              color: theme.palette.error.main,
            },
          ],
        },
      }),
    [theme]
  );
};
export default useDashboardWidgets;
