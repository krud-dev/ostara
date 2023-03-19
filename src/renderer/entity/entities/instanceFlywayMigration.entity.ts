import { Entity } from 'renderer/entity/entity';
import { EnrichedFlywayMigration } from 'renderer/apis/requests/instance/flyway/getInstanceFlywayMigrations';
import FlywayMigrationDetails from 'renderer/pages/navigator/instance/flyway/components/FlywayMigrationDetails';
import TableCellDataFlywayMigrationVersion from '../../components/table/data/custom/TableCellDataFlywayMigrationVersion';

export const instanceFlywayMigrationEntity: Entity<EnrichedFlywayMigration> = {
  id: 'instanceFlywayMigration',
  columns: [
    {
      id: 'installedRank',
      type: 'Number',
      labelId: 'installedRank',
    },
    {
      id: 'version',
      type: 'Custom',
      labelId: 'version',
      Component: TableCellDataFlywayMigrationVersion,
    },
    {
      id: 'description',
      type: 'Text',
      labelId: 'description',
    },
    {
      id: 'installedOn',
      type: 'ParsedDate',
      labelId: 'installedOn',
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
          case 'OUT_OF_ORDER':
            return 'warning';
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
    Component: FlywayMigrationDetails,
  },
  defaultOrder: [
    {
      id: 'installedRank',
      direction: 'desc',
    },
  ],
  paging: true,
  getId: (item) => `${item.script}_${item.installedOn}`,
  filterData: (data, filter) =>
    data.filter(
      (item) =>
        item.description?.toLowerCase().includes(filter.toLowerCase()) ||
        item.installedBy?.toLowerCase().includes(filter.toLowerCase()) ||
        item.installedRank?.toString().toLowerCase().includes(filter.toLowerCase())
    ),
};
