import { Entity } from 'renderer/entity/entity';
import { TogglzFeatureActuatorResponse } from '../../../common/generated_definitions';
import TableCellDataInstanceTogglzToggle from '../../components/table/data/custom/TableCellDataInstanceTogglzToggle';

export const instanceTogglzEntity: Entity<TogglzFeatureActuatorResponse> = {
  id: 'instanceCache',
  columns: [
    {
      id: 'name',
      type: 'Text',
      labelId: 'name',
      width: '100%',
    },
    {
      id: 'strategy',
      type: 'Text',
      labelId: 'strategy',
    },
    {
      id: 'toggle',
      type: 'Custom',
      labelId: 'toggle',
      width: 200,
      Component: TableCellDataInstanceTogglzToggle,
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
  paging: true,
  getId: (item) => item.name,
  filterData: (data, filter) =>
    data.filter(
      (item) =>
        item.name?.toLowerCase().includes(filter.toLowerCase()) &&
        item.strategy?.toLowerCase().includes(filter.toLowerCase())
    ),
};
