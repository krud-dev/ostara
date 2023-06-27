import React, { FunctionComponent, useMemo } from 'react';
import NiceModal, { NiceModalHocProps } from '@ebay/nice-modal-react';
import { EnrichedInstanceCacheRO } from 'renderer/apis/requests/instance/caches/getInstanceCaches';
import { useGetInstanceCacheStatisticsQuery } from 'renderer/apis/requests/instance/caches/getInstanceCacheStatistics';
import { ItemCacheStatistics } from 'renderer/components/item/cache/ItemCacheDetails';
import ItemCacheStatisticsDialog from 'renderer/components/item/cache/ItemCacheStatisticsDialog';

export type InstanceCacheStatisticsDialogProps = {
  row: EnrichedInstanceCacheRO;
} & NiceModalHocProps;

const InstanceCacheStatisticsDialog: FunctionComponent<InstanceCacheStatisticsDialogProps> = NiceModal.create(
  ({ row }) => {
    const statisticsQuery = useGetInstanceCacheStatisticsQuery({ instanceId: row.instanceId, cacheName: row.name });
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

    return <ItemCacheStatisticsDialog cacheName={row.name} statistics={statistics} queryState={statisticsQuery} />;
  }
);

export default InstanceCacheStatisticsDialog;
