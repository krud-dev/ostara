import { Entity } from 'renderer/entity/entity';
import TableCellDataInstanceLoggerLevel from 'renderer/components/table/data/TableCellDataInstanceLoggerLevel';
import { RESET_ID } from 'renderer/entity/actions';
import { EnrichedInstanceLoggerRO } from 'renderer/apis/requests/instance/getInstanceLoggers';
import { isClassName } from 'renderer/utils/classUtils';
import LoggerCustomFiltersComponent, {
  LoggerCustomFilters,
} from 'renderer/components/item/logger/LoggerCustomFiltersComponent';

export const instanceLoggerEntity: Entity<EnrichedInstanceLoggerRO, LoggerCustomFilters> = {
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
      width: 370,
      Component: TableCellDataInstanceLoggerLevel,
    },
  ],
  actions: [
    {
      id: RESET_ID,
      labelId: 'reset',
      icon: 'RotateLeftOutlined',
      isDisabled: (item) => item.name === 'ROOT' || !item.configuredLevel,
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
  filterData: (data, filter, customFilters) =>
    data.filter(
      (item) =>
        item.name?.toLowerCase().includes(filter.toLowerCase()) &&
        (!customFilters?.configured || !!item.configuredLevel) &&
        (!customFilters?.classes || isClassName(item.name))
    ),
  CustomFiltersComponent: LoggerCustomFiltersComponent,
};
