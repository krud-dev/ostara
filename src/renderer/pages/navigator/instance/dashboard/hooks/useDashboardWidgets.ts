import { useMemo } from 'react';
import {
  DataBarWidget,
  ProgressCircleWidget,
  StackedTimelineWidget,
  Widget,
} from '../../../../../components/widget/widget';
import { useTheme } from '@mui/material/styles';

const useDashboardWidgets = (): Widget[] => {
  const theme = useTheme();

  return useMemo<Widget[]>(
    () => [
      <DataBarWidget>{
        id: 'process-widget',
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
            valueType: 'number',
          },
          {
            name: 'system.cpu.count[VALUE]',
            titleId: 'cpuCount',
            order: 2,
            valueType: 'number',
          },
        ],
      },
      <StackedTimelineWidget>{
        id: 'thread-count',
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
      <StackedTimelineWidget>{
        id: 'memory-use-timeline',
        type: 'stacked-timeline',
        titleId: 'memoryUseMb',
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
      <ProgressCircleWidget>{
        id: 'memory-use-circle',
        type: 'progress-circle',
        titleId: 'memoryUse',
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
    ],
    [theme]
  );
};
export default useDashboardWidgets;
