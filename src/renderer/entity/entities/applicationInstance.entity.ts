import { Entity } from 'renderer/entity/entity';
import { EnrichedInstance } from 'infra/configuration/model/configuration';
import TableCellDataHealthStatus from 'renderer/components/table/data/TableCellDataHealthStatus';

export const applicationInstance: Entity<EnrichedInstance> = {
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
  defaultOrder: {
    id: 'name',
    direction: 'asc',
  },
  paging: false,
  getId: (item) => item.id,
  filterData: (data, filter) => data.filter((item) => item.alias?.toLowerCase().includes(filter.toLowerCase())),
};
