import React, { FunctionComponent, useMemo } from 'react';
import NiceModal, { NiceModalHocProps } from '@ebay/nice-modal-react';
import { ItemCacheStatistics } from '../../../../../components/item/cache/ItemCacheDetails';
import { EnrichedApplicationCacheRO } from '../../../../../apis/requests/application/caches/getApplicationCaches';
import { useGetApplicationCacheStatisticsQuery } from '../../../../../apis/requests/application/caches/getApplicationCacheStatistics';
import ItemCacheStatisticsDialog from '../../../../../components/item/cache/ItemCacheStatisticsDialog';

export type ApplicationCacheStatisticsDialogProps = {
  row: EnrichedApplicationCacheRO;
};

const ApplicationCacheStatisticsDialog: FunctionComponent<ApplicationCacheStatisticsDialogProps & NiceModalHocProps> =
  NiceModal.create(({ row }) => {
    const statisticsQuery = useGetApplicationCacheStatisticsQuery({
      applicationId: row.applicationId,
      cacheName: row.name,
    });
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
  });

export default ApplicationCacheStatisticsDialog;
