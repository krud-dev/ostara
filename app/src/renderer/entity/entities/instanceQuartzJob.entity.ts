import { Entity } from 'renderer/entity/entity';
import { EnrichedQuartzJob } from '../../apis/requests/instance/quartz/getInstanceQuartzJobs';
import QuartzJobDetails from '../../pages/navigator/instance/quartz/components/QuartzJobDetails';

export const instanceQuartzJobEntity: Entity<EnrichedQuartzJob> = {
  id: 'instanceQuartzJob',
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
    Component: QuartzJobDetails,
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
