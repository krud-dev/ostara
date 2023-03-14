import { Entity } from 'renderer/entity/entity';
import { EnrichedMappingsServletFilter } from '../../apis/requests/instance/mappings/getInstanceMappingsServletFilters';
import MappingsServletFilterDetails from '../../pages/navigator/instance/mappings/components/MappingsServletFilterDetails';

export const instanceMappingsServletFilterEntity: Entity<EnrichedMappingsServletFilter> = {
  id: 'instanceMappingsServletFilter',
  columns: [
    {
      id: 'name',
      type: 'Text',
      labelId: 'name',
    },
    {
      id: 'context',
      type: 'Text',
      labelId: 'context',
    },
  ],
  actions: [],
  massActions: [],
  globalActions: [],
  rowAction: {
    type: 'Details',
    Component: MappingsServletFilterDetails,
  },
  defaultOrder: [
    {
      id: 'name',
      direction: 'asc',
    },
    {
      id: 'context',
      direction: 'asc',
    },
  ],
  paging: true,
  getId: (item) => `${item.context}_${item.name}`,
  filterData: (data, filter) =>
    data.filter(
      (item) =>
        item.name?.toLowerCase().includes(filter.toLowerCase()) ||
        item.context?.toLowerCase().includes(filter.toLowerCase())
    ),
};
