import { Entity } from 'renderer/entity/entity';
import { EnrichedActuatorFlywayMigration } from 'renderer/apis/instance/getInstanceFlywayMigrations';

export const instanceFlywayMigrationEntity: Entity<EnrichedActuatorFlywayMigration> = {
  id: 'instanceFlywayMigration',
  columns: [
    {
      id: 'description',
      type: 'Text',
      labelId: 'description',
    },
    {
      id: 'type',
      type: 'Text',
      labelId: 'type',
    },
    {
      id: 'script',
      type: 'Text',
      labelId: 'script',
    },
    {
      id: 'state',
      type: 'Label',
      labelId: 'state',
      getColor: (item) => (item.state === 'SUCCESS' ? 'success' : 'warning'),
    },
    {
      id: 'executionTime',
      type: 'Number',
      labelId: 'executionTime',
    },
    {
      id: 'installedBy',
      type: 'Text',
      labelId: 'installedBy',
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
    {
      id: 'version',
      type: 'Text',
      labelId: 'version',
    },
    {
      id: 'checksum',
      type: 'Text',
      labelId: 'checksum',
    },
  ],
  actions: [],
  massActions: [],
  globalActions: [],
  defaultOrder: [
    {
      id: 'name',
      direction: 'asc',
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
