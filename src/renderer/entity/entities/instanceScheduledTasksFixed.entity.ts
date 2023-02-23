import { Entity } from 'renderer/entity/entity';
import { ScheduledTasksActuatorResponse$FixedDelayOrRate } from '../../../common/generated_definitions';

export const instanceScheduledTasksFixedEntity: Entity<ScheduledTasksActuatorResponse$FixedDelayOrRate> = {
  id: 'instanceScheduledTasksFixed',
  columns: [
    {
      id: 'runnable.target',
      type: 'Text',
      labelId: 'target',
      width: '100%',
    },
    {
      id: 'initialDelay',
      type: 'Number',
      labelId: 'initialDelay',
    },
    {
      id: 'interval',
      type: 'Number',
      labelId: 'interval',
    },
  ],
  actions: [],
  massActions: [],
  globalActions: [],
  defaultOrder: [
    {
      id: 'runnable.target',
      direction: 'asc',
    },
  ],
  paging: true,
  getId: (item) => item.runnable.target,
  filterData: (data, filter) =>
    data.filter(
      (item) =>
        item.runnable?.target?.toLowerCase().includes(filter.toLowerCase()) ||
        item.initialDelay?.toString().includes(filter.toLowerCase()) ||
        item.interval?.toString().includes(filter.toLowerCase())
    ),
};
