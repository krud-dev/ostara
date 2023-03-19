import { Entity } from 'renderer/entity/entity';
import { RESET_ID } from 'renderer/entity/actions';
import { isClassName } from 'renderer/utils/classUtils';
import LoggerCustomFiltersComponent, {
  LoggerCustomFilters,
} from 'renderer/components/item/logger/LoggerCustomFiltersComponent';
import { EnrichedApplicationLoggerRO } from 'renderer/apis/requests/application/loggers/getApplicationLoggers';
import { every, some } from 'lodash';
import TableCellDataApplicationLoggerLevel from 'renderer/components/table/data/custom/TableCellDataApplicationLoggerLevel';

export const applicationLoggerEntity: Entity<EnrichedApplicationLoggerRO, LoggerCustomFilters> = {
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
      Component: TableCellDataApplicationLoggerLevel,
    },
  ],
  actions: [
    {
      id: RESET_ID,
      labelId: 'reset',
      icon: 'RotateLeftOutlined',
      isDisabled: (item) => item.name === 'ROOT' || every(item.loggers, (logger) => !logger.configuredLevel),
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
        (!customFilters?.configured || some(item.loggers, (logger) => !!logger.configuredLevel)) &&
        (!customFilters?.classes || isClassName(item.name))
    ),
  CustomFiltersComponent: LoggerCustomFiltersComponent,
};
