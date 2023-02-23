import { Entity } from 'renderer/entity/entity';
import { ScheduledTasksActuatorResponse$Custom } from '../../../common/generated_definitions';

export const instanceScheduledTasksCustomEntity: Entity<ScheduledTasksActuatorResponse$Custom> = {
  id: 'instanceScheduledTasksCustom',
  columns: [
    {
      id: 'runnable.target',
      type: 'Text',
      labelId: 'target',
      width: '100%',
    },
    {
      id: 'trigger',
      type: 'Text',
      labelId: 'trigger',
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
        item.trigger?.toLowerCase().includes(filter.toLowerCase())
    ),
};
