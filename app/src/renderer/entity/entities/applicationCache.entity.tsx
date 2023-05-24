import { Entity } from 'renderer/entity/entity';
import { EVICT_CACHE_ID, STATISTICS_ID } from 'renderer/entity/actions';
import { EnrichedApplicationCacheRO } from '../../apis/requests/application/caches/getApplicationCaches';
import { FormattedMessage } from 'react-intl';
import { Link } from '@mui/material';
import { ABILITIES_DOCUMENTATION_URL } from '../../constants/ui';

export const applicationCacheEntity: Entity<EnrichedApplicationCacheRO> = {
  id: 'applicationCache',
  columns: [
    {
      id: 'name',
      type: 'Text',
      labelId: 'name',
    },
    {
      id: 'cacheManager',
      type: 'Text',
      labelId: 'cacheManager',
    },
  ],
  actions: [
    {
      id: STATISTICS_ID,
      labelId: 'showStatistics',
      icon: 'DonutLargeOutlined',
      isDisabled: (item) => {
        if (!item.hasStatistics) {
          return (
            <>
              <FormattedMessage id={'cacheStatisticsNotAvailable'} /> (
              <Link
                href={'#'}
                onClick={(event) => {
                  event.preventDefault();
                  window.open(ABILITIES_DOCUMENTATION_URL, '_blank');
                }}
              >
                <FormattedMessage id={'readMore'} />
              </Link>
              )
            </>
          );
        }
        return false;
      },
    },
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
