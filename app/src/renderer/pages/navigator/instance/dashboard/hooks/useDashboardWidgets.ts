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

const useDashboardWidgets = () => {
  const theme = useTheme();

  const asWidgets = useCallback(<T extends { [key: string]: Widget }>(arg: T): T => {
    return arg;
  }, []);

  return useMemo(
    () =>
      asWidgets({
        processWidget: <DataBarWidget>{
          id: 'processWidget',
          type: 'data-bar',
          titleId: 'process',
          metrics: [
            {
              name: 'process.uptime[VALUE]',
              titleId: 'uptime',
              order: 0,
              valueType: 'seconds',
            },
            {
              name: 'process.cpu.usage[VALUE]',
              titleId: 'cpuUsage',
              order: 1,
              valueType: 'percent',
            },
            {
              name: 'system.cpu.count[VALUE]',
              titleId: 'cpuCount',
              order: 2,
              valueType: 'number',
            },
          ],
        },
        uptimeWidget: <CountdownWidget>{
          id: 'uptimeWidget',
          type: 'countdown',
          titleId: 'uptime',
          metricName: 'process.uptime[VALUE]',
        },
        healthStatusWidget: <HealthStatusWidget>{
          id: 'healthStatusWidget',
          type: 'health-status',
          titleId: 'status',
        },
        threadCount: <StackedTimelineWidget>{
          id: 'threadCount',
          type: 'stacked-timeline',
          titleId: 'threadCount',
          metrics: [
            {
              name: 'jvm.threads.live[VALUE]',
              titleId: 'liveThreadCount',
              order: 0,
              color: theme.palette.primary.main,
              valueType: 'number',
            },
            {
              name: 'jvm.threads.daemon[VALUE]',
              titleId: 'daemonThreadCount',
              order: 1,
              color: theme.palette.warning.main,
              valueType: 'number',
            },
          ],
        },
        memoryUsageTimeline: <StackedTimelineWidget>{
          id: 'memoryUsageTimeline',
          type: 'stacked-timeline',
          titleId: 'memoryUsageMb',
          metrics: [
            {
              name: 'jvm.memory.used[VALUE]',
              titleId: 'memoryUsedMb',
              order: 0,
              color: theme.palette.primary.main,
              valueType: 'bytes',
            },
            {
              name: 'jvm.memory.committed[VALUE]',
              titleId: 'memoryCommittedMb',
              order: 1,
              color: theme.palette.warning.main,
              valueType: 'bytes',
            },
          ],
        },
        memoryUsageCircle: <ProgressCircleWidget>{
          id: 'memoryUsageCircle',
          type: 'progress-circle',
          titleId: 'memoryUsage',
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
          titleId: 'diskUsage',
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
          titleId: 'cpuUsage',
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
