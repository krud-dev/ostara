import React, { useMemo } from 'react';
import { useNavigatorTree } from 'renderer/contexts/NavigatorTreeContext';
import { useGetApplicationCacheStatisticsQuery } from 'renderer/apis/requests/application/caches/getApplicationCacheStatistics';
import ItemCacheDetails, { ItemCacheStatistics } from 'renderer/components/item/cache/ItemCacheDetails';
import { ApplicationCacheRO, ApplicationRO } from '../../../../../../common/generated_definitions';

type ApplicationCacheDetailsProps = {
  row: ApplicationCacheRO;
};

export default function ApplicationCacheDetails({ row }: ApplicationCacheDetailsProps) {
  const { selectedItem } = useNavigatorTree();

  const item = useMemo<ApplicationRO>(() => selectedItem as ApplicationRO, [selectedItem]);

  const statisticsQuery = useGetApplicationCacheStatisticsQuery({ applicationId: item.id, cacheName: row.name });
  const statistics = useMemo<ItemCacheStatistics | undefined>(
    () =>
      statisticsQuery.data
        ? {
            gets: { value: statisticsQuery.data.gets },
            puts: { value: statisticsQuery.data.puts },
            evictions: { value: statisticsQuery.data.evictions },
            hits: { value: statisticsQuery.data.hits },
            misses: { value: statisticsQuery.data.misses },
            removals: { value: statisticsQuery.data.removals },
            size: { value: statisticsQuery.data.size },
          }
        : undefined,
    [statisticsQuery.data]
  );

  return <ItemCacheDetails statistics={statistics} />;
}
