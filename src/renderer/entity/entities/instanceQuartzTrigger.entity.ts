import { Entity } from 'renderer/entity/entity';
import { EnrichedQuartzTrigger } from '../../apis/requests/instance/quartz/getInstanceQuartzTriggers';
import QuartzTriggerDetails from '../../pages/navigator/instance/quartz/components/QuartzTriggerDetails';

export const instanceQuartzTriggerEntity: Entity<EnrichedQuartzTrigger> = {
  id: 'instanceQuartzTrigger',
  columns: [
    {
      id: 'group',
      type: 'Text',
      labelId: 'group',
    },
    {
      id: 'name',
      type: 'Text',
      labelId: 'name',
    },
  ],
  actions: [],
  massActions: [],
  globalActions: [],
  rowAction: {
    type: 'Details',
    Component: QuartzTriggerDetails,
  },
  defaultOrder: [
    {
      id: 'group',
      direction: 'asc',
    },
    {
      id: 'name',
      direction: 'asc',
    },
  ],
  paging: true,
  getId: (item) => item.name,
  filterData: (data, filter) =>
    data.filter(
      (item) =>
        item.name?.toLowerCase().includes(filter.toLowerCase()) ||
        item.group?.toLowerCase().includes(filter.toLowerCase())
    ),
};
