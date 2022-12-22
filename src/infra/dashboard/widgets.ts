import { DataBarWidget, ProgressCircleWidget, StackedTimelineWidget } from './model';

export const springBootWidgets = {
  threadCount: <StackedTimelineWidget>{
    type: 'stacked-timeline',
    title: 'Thread Count',
    description: 'Thread Count',
    metrics: [
      {
        name: 'jvm.threads.live[VALUE]',
        title: 'Live Thread Count',
        sort: 0,
        color: '#ff0000',
      },
      {
        name: 'jvm.threads.daemon[VALUE]',
        title: 'Daemon Thread Count',
        sort: 1,
        color: '#00ff00',
      },
    ],
  },
  memoryUse: <StackedTimelineWidget>{
    type: 'stacked-timeline',
    title: 'Memory Use',
    description: 'Shows the memory usage',
    metrics: [
      {
        name: 'jvm.memory.used[VALUE]',
        title: 'Memory Used',
        sort: 0,
        color: '#ff0000',
      },
      {
        name: 'jvm.memory.committed[VALUE]',
        title: 'Memory Committed',
        sort: 1,
        color: '#00ff00',
      },
    ],
  },
  memoryUseCircle: <ProgressCircleWidget>{
    type: 'progress-circle',
    title: 'Memory Use',
    description: 'Shows the memory usage',
    maxMetricName: 'jvm.memory.max[VALUE]',
    currentMetricName: 'jvm.memory.used[VALUE]',
  },
  processWidget: <DataBarWidget>{
    type: 'data-bar',
    title: 'Process',
    description: 'Shows the process information',
    metrics: [
      {
        name: 'process.uptime[VALUE]',
        title: 'Uptime',
        sort: 0,
      },
      {
        name: 'process.cpu.usage[VALUE]',
        title: 'CPU Usage',
        sort: 1,
      },
      {
        name: 'system.cpu.count[VALUE]',
        title: 'CPU Count',
        sort: 2,
      },
    ],
  },
};
