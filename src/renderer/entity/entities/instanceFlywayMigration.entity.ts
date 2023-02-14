import { Entity } from 'renderer/entity/entity';
import { EnrichedFlywayMigration } from 'renderer/apis/instance/getInstanceFlywayMigrations';
import FlywayMigrationDetails from 'renderer/pages/navigator/instance/flyway/components/FlywayMigrationDetails';

export const instanceFlywayMigrationEntity: Entity<EnrichedFlywayMigration> = {
  id: 'instanceFlywayMigration',
  columns: [
    {
      id: 'installedBy',
      type: 'Text',
      labelId: 'installedBy',
    },
    {
      id: 'description',
      type: 'Text',
      labelId: 'description',
    },
    {
      id: 'state',
      type: 'Label',
      labelId: 'state',
      getColor: (item) => {
        switch (item.state) {
          case 'SUCCESS':
          case 'FUTURE_SUCCESS':
            return 'success';
          default:
            return 'default';
        }
      },
    },
    {
      id: 'installedOn',
      type: 'Date',
      labelId: 'installedOn',
    },
    {
      id: 'installedRank',
      type: 'Number',
      labelId: 'installedRank',
    },
  ],
  actions: [],
  massActions: [],
  globalActions: [],
  rowAction: {
    type: 'Details',
    Component: FlywayMigrationDetails,
  },
  defaultOrder: [
    {
      id: 'installedRank',
      direction: 'desc',
    },
  ],
  paging: false,
  getId: (item) => `${item.script}_${item.installedOn}`,
  getGrouping: (item) => item.bean,
  filterData: (data, filter) =>
    data.filter(
      (item) =>
        item.description?.toLowerCase().includes(filter.toLowerCase()) ||
        item.script?.toLowerCase().includes(filter.toLowerCase()) ||
        item.type?.toLowerCase().includes(filter.toLowerCase()) ||
        item.installedBy?.toLowerCase().includes(filter.toLowerCase()) ||
        item.version?.toLowerCase().includes(filter.toLowerCase())
    ),
};
