import { Entity } from 'renderer/entity/entity';
import { EVICT_CACHE_ID } from 'renderer/entity/actions';
import InstanceCacheDetails from 'renderer/pages/navigator/instance/caches/components/InstanceCacheDetails';
import { EnrichedInstanceCacheRO } from 'renderer/apis/requests/instance/getInstanceCaches';

export const instanceCacheEntity: Entity<EnrichedInstanceCacheRO> = {
  id: 'instanceCache',
  columns: [
    {
      id: 'name',
      type: 'Text',
      labelId: 'name',
      getTooltip: (item) => item.target,
    },
    {
      id: 'cacheManager',
      type: 'Text',
      labelId: 'cacheManager',
    },
  ],
  actions: [
    {
      id: EVICT_CACHE_ID,
      labelId: 'evict',
      icon: 'CleaningServicesOutlined',
    },
  ],
  massActions: [
    {
      id: EVICT_CACHE_ID,
      labelId: 'evict',
      icon: 'CleaningServicesOutlined',
    },
  ],
  globalActions: [
    {
      id: EVICT_CACHE_ID,
      labelId: 'evictAll',
      icon: 'CleaningServicesOutlined',
    },
  ],
  rowAction: {
    type: 'Details',
    Component: InstanceCacheDetails,
  },
  isRowActionActive: (item) => item.hasStatistics,
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
        item.cacheManager?.toLowerCase().includes(filter.toLowerCase())
    ),
};
