import { Entity } from 'renderer/entity/entity';
import TableCellDataHealthStatus from 'renderer/components/table/data/custom/TableCellDataHealthStatus';
import { generatePath } from 'react-router-dom';
import { urls } from 'renderer/routes/urls';
import { InstanceRO } from '../../../common/generated_definitions';
import { getItemDisplayName } from '../../utils/itemUtils';

export const applicationInstanceEntity: Entity<InstanceRO> = {
  id: 'applicationInstance',
  columns: [
    {
      id: 'alias',
      type: 'CustomText',
      labelId: 'name',
      getText: (item) => getItemDisplayName(item),
      getTooltip: (item) => item.actuatorUrl,
    },
    {
      id: 'health.status',
      type: 'Custom',
      labelId: 'healthStatus',
      getTooltip: (item) => item.health?.statusText,
      Component: TableCellDataHealthStatus,
    },
    {
      id: 'health.lastUpdateTime',
      type: 'Date',
      labelId: 'lastUpdateTime',
    },
    {
      id: 'health.lastStatusChangeTime',
      type: 'Date',
      labelId: 'lastChangeTime',
    },
  ],
  actions: [],
  massActions: [],
  globalActions: [],
  rowAction: {
    type: 'Navigate',
    getUrl: (item) => generatePath(urls.instance.url, { id: item.id }),
  },
  defaultOrder: [
    {
      id: 'name',
      direction: 'asc',
    },
  ],
  paging: true,
  getId: (item) => item.id,
  filterData: (data, filter) => data.filter((item) => item.alias?.toLowerCase().includes(filter.toLowerCase())),
};
