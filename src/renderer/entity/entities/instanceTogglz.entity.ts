import { Entity } from 'renderer/entity/entity';
import TableCellDataInstanceTogglzToggle from '../../components/table/data/custom/TableCellDataInstanceTogglzToggle';
import { EnrichedTogglzFeature } from '../../apis/requests/instance/togglz/getInstanceTogglz';
import { DISABLE_ID, ENABLE_ID } from '../actions';

export const instanceTogglzEntity: Entity<EnrichedTogglzFeature> = {
  id: 'instanceTogglz',
  columns: [
    {
      id: 'name',
      type: 'Text',
      labelId: 'name',
    },
    {
      id: 'status',
      type: 'Custom',
      labelId: 'status',
      width: 100,
      Component: TableCellDataInstanceTogglzToggle,
    },
    {
      id: 'strategy',
      type: 'Text',
      labelId: 'strategy',
    },
  ],
  actions: [],
  massActions: [],
  globalActions: [
    { id: DISABLE_ID, labelId: 'disableAll', icon: 'ToggleOffOutlined' },
    { id: ENABLE_ID, labelId: 'enableAll', icon: 'ToggleOnOutlined' },
  ],
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
        item.name?.toLowerCase().includes(filter.toLowerCase()) ||
        item.strategy?.toLowerCase().includes(filter.toLowerCase())
    ),
};
