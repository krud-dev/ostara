import { DataBarWidget, ProgressCircleWidget, StackedTimelineWidget } from './model';

export const springBootWidgets = {
  threadCount: <StackedTimelineWidget>{
    id: 'thread-count',
    type: 'stacked-timeline',
    title: 'Thread Count',
    description: 'Thread Count',
    metrics: [
      {
        name: 'jvm.threads.live[VALUE]',
        title: 'Live Thread Count',
        order: 0,
        color: '#ff0000',
      },
      {
        name: 'jvm.threads.daemon[VALUE]',
        title: 'Daemon Thread Count',
        order: 1,
        color: '#00ff00',
      },
    ],
  },
  memoryUse: <StackedTimelineWidget>{
    id: 'memory-use-timeline',
    type: 'stacked-timeline',
    title: 'Memory Use',
    description: 'Shows the memory usage',
    metrics: [
      {
        name: 'jvm.memory.used[VALUE]',
        title: 'Memory Used',
        order: 0,
        color: '#ff0000',
      },
      {
        name: 'jvm.memory.committed[VALUE]',
        title: 'Memory Committed',
        order: 1,
        color: '#00ff00',
      },
    ],
  },
  memoryUseCircle: <ProgressCircleWidget>{
    id: 'memory-use-circle',
    type: 'progress-circle',
    title: 'Memory Use',
    description: 'Shows the memory usage',
    maxMetricName: 'jvm.memory.max[VALUE]',
    currentMetricName: 'jvm.memory.used[VALUE]',
    color: '#00ff00',
    colorThresholds: [
      {
        value: 0,
        color: '#00ff00',
      },
      {
        value: 70,
        color: '#ffff00',
      },
      {
        value: 90,
        color: '#ff0000',
      },
    ],
  },
  processWidget: <DataBarWidget>{
    id: 'process-widget',
    type: 'data-bar',
    title: 'Process',
    description: 'Shows the process information',
    metrics: [
      {
        name: 'process.uptime[VALUE]',
        title: 'Uptime',
        order: 0,
      },
      {
        name: 'process.cpu.usage[VALUE]',
        title: 'CPU Usage',
        order: 1,
      },
      {
        name: 'system.cpu.count[VALUE]',
        title: 'CPU Count',
        order: 2,
      },
    ],
  },
};
