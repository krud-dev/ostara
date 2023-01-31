import { Entity } from 'renderer/entity/entity';
import TableCellDataInstanceLoggerLevel from 'renderer/components/table/data/TableCellDataInstanceLoggerLevel';
import { RESET_ID } from 'renderer/entity/actions';
import { EnrichedInstanceLogger } from 'renderer/apis/instance/getInstanceLoggers';

export const instanceLoggerEntity: Entity<EnrichedInstanceLogger> = {
  id: 'instanceCache',
  columns: [
    {
      id: 'name',
      type: 'Text',
      labelId: 'name',
      width: '100%',
    },
    {
      id: 'effectiveLevel',
      type: 'Custom',
      labelId: 'level',
      width: 410,
      Component: TableCellDataInstanceLoggerLevel,
    },
  ],
  actions: [
    {
      id: RESET_ID,
      labelId: 'reset',
      icon: 'RotateLeftOutlined',
      isDisabled: (item) => !item.configuredLevel || item.name === 'ROOT',
    },
  ],
  massActions: [],
  globalActions: [],
  defaultOrder: [
    {
      id: 'name',
      direction: 'asc',
    },
  ],
  paging: true,
  getId: (item) => item.name,
  filterData: (data, filter) => data.filter((item) => item.name?.toLowerCase().includes(filter.toLowerCase())),
};
