import { Entity } from 'renderer/entity/entity';
import { ScheduledTasksActuatorResponse$Cron } from '../../../common/generated_definitions';

export const instanceScheduledTasksCronEntity: Entity<ScheduledTasksActuatorResponse$Cron> = {
  id: 'instanceScheduledTasksCron',
  columns: [
    {
      id: 'runnable.target',
      type: 'Text',
      labelId: 'target',
      width: '100%',
    },
    {
      id: 'expression',
      type: 'Text',
      labelId: 'expression',
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
        item.expression?.toLowerCase().includes(filter.toLowerCase())
    ),
};
