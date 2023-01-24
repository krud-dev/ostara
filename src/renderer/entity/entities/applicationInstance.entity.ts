import { Entity } from 'renderer/entity/entity';
import { EnrichedInstance } from 'infra/configuration/model/configuration';
import TableCellDataHealthStatus from 'renderer/components/table/data/TableCellDataHealthStatus';
import { generatePath } from 'react-router-dom';
import { urls } from 'renderer/routes/urls';

export const applicationInstanceEntity: Entity<EnrichedInstance> = {
  id: 'applicationInstance',
  columns: [
    {
      id: 'alias',
      type: 'Text',
      labelId: 'name',
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
  paging: false,
  getId: (item) => item.id,
  filterData: (data, filter) => data.filter((item) => item.alias?.toLowerCase().includes(filter.toLowerCase())),
};
