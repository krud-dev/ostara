import { Entity } from 'renderer/entity/entity';
import { EnrichedActuatorLiquibaseChangeset } from 'renderer/apis/instance/getInstanceLiquibaseChangesets';

export const instanceLiquibaseChangesetEntity: Entity<EnrichedActuatorLiquibaseChangeset> = {
  id: 'instanceLiquibaseChangeset',
  columns: [
    {
      id: 'author',
      type: 'Text',
      labelId: 'author',
    },
    {
      id: 'changelog',
      type: 'Text',
      labelId: 'changelog',
    },
    {
      id: 'description',
      type: 'Text',
      labelId: 'description',
    },
    {
      id: 'comments',
      type: 'Text',
      labelId: 'comments',
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
    {
      id: 'dateExecuted',
      type: 'Text',
      labelId: 'dateExecuted',
    },
    {
      id: 'orderExecuted',
      type: 'Number',
      labelId: 'orderExecuted',
    },
  ],
  actions: [],
  massActions: [],
  globalActions: [],
  defaultOrder: [
    {
      id: 'orderExecuted',
      direction: 'desc',
    },
  ],
  paging: false,
  getId: (item) => item.id,
  getGrouping: (item) => item.bean,
  filterData: (data, filter) =>
    data.filter(
      (item) =>
        item.description?.toLowerCase().includes(filter.toLowerCase()) ||
        item.author?.toLowerCase().includes(filter.toLowerCase()) ||
        item.changeLog?.toLowerCase().includes(filter.toLowerCase()) ||
        item.comments?.toLowerCase().includes(filter.toLowerCase())
    ),
};
