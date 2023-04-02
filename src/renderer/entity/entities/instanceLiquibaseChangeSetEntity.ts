import { Entity } from 'renderer/entity/entity';
import { EnrichedLiquibaseChangeSet } from 'renderer/apis/requests/instance/liquibase/getInstanceLiquibaseChangesets';
import LiquibaseChangesetDetails from 'renderer/pages/navigator/instance/liquibase/components/LiquibaseChangesetDetails';

export const instanceLiquibaseChangeSetEntity: Entity<EnrichedLiquibaseChangeSet> = {
  id: 'instanceLiquibaseChangeSet',
  columns: [
    {
      id: 'orderExecuted',
      type: 'Number',
      labelId: 'orderExecuted',
    },
    {
      id: 'description',
      type: 'Text',
      labelId: 'description',
      width: 250,
    },
    {
      id: 'dateExecuted',
      type: 'ParsedDate',
      labelId: 'dateExecuted',
    },
    {
      id: 'execType',
      type: 'Label',
      labelId: 'executionType',
      getColor: (item) => {
        switch (item.execType) {
          case 'EXECUTED':
            return 'success';
          case 'FAILED':
            return 'error';
          case 'SKIPPED':
          case 'RERAN':
            return 'warning';
          case 'MARK_RAN':
          default:
            return 'default';
        }
      },
    },
  ],
  actions: [],
  massActions: [],
  globalActions: [],
  rowAction: {
    type: 'Details',
    Component: LiquibaseChangesetDetails,
  },
  defaultOrder: [
    {
      id: 'orderExecuted',
      direction: 'desc',
    },
  ],
  paging: true,
  getId: (item) => item.id,
  filterData: (data, filter) =>
    data.filter(
      (item) =>
        item.description?.toLowerCase().includes(filter.toLowerCase()) ||
        item.author?.toLowerCase().includes(filter.toLowerCase()) ||
        item.orderExecuted?.toString().toLowerCase().includes(filter.toLowerCase())
    ),
};
