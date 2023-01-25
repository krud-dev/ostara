import { TaskDefinitionDisplay } from 'infra/tasks/types';
import { Entity } from 'renderer/entity/entity';
import { RUN_TASK_ID } from 'renderer/entity/actions';

export const taskEntity: Entity<TaskDefinitionDisplay> = {
  id: 'task',
  columns: [
    {
      id: 'alias',
      type: 'Text',
      labelId: 'name',
      width: 200,
    },
    {
      id: 'description',
      type: 'Text',
      labelId: 'description',
      width: 250,
    },
    {
      id: 'defaultCron',
      type: 'Cron',
      labelId: 'cron',
      getTooltip: (item) => item.defaultCron,
    },
    {
      id: 'nextRun',
      type: 'Date',
      labelId: 'nextRun',
    },
  ],
  actions: [
    {
      id: RUN_TASK_ID,
      labelId: 'run',
      icon: 'PlayCircleFilledWhiteOutlined',
    },
  ],
  massActions: [],
  globalActions: [],
  defaultOrder: [
    {
      id: 'alias',
      direction: 'asc',
    },
  ],
  paging: false,
  getId: (item) => item.name,
  filterData: (data, filter) =>
    data.filter(
      (item) =>
        item.alias?.toLowerCase().includes(filter.toLowerCase()) ||
        item.name?.toLowerCase().includes(filter.toLowerCase()) ||
        item.description?.toLowerCase().includes(filter.toLowerCase()) ||
        item.cron?.toLowerCase().includes(filter.toLowerCase())
    ),
};
