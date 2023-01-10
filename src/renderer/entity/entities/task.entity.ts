import { TaskDefinitionDisplay } from 'infra/tasks/types';
import { Entity } from 'renderer/entity/entity';

export const RUN_TASK_ID = 'runTask';

export const taskEntity: Entity<TaskDefinitionDisplay> = {
  columns: [
    {
      id: 'alias',
      type: 'Text',
      labelId: 'name',
    },
    {
      id: 'description',
      type: 'Text',
      labelId: 'description',
    },
    {
      id: 'defaultCron',
      type: 'Cron',
      labelId: 'cron',
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
  defaultOrder: {
    id: 'alias',
    direction: 'asc',
  },
  paging: false,
  getId: (item) => item.name,
  filterData: (data, filter) =>
    data.filter(
      (task) =>
        task.alias.toLowerCase().includes(filter.toLowerCase()) ||
        task.name.toLowerCase().includes(filter.toLowerCase()) ||
        task.description.toLowerCase().includes(filter.toLowerCase()) ||
        task.cron.toLowerCase().includes(filter.toLowerCase())
    ),
};
