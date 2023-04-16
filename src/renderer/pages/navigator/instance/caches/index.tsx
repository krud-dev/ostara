import React, { FunctionComponent, useCallback, useMemo } from 'react';
import Page from 'renderer/components/layout/Page';
import { useNavigatorTree } from 'renderer/contexts/NavigatorTreeContext';
import TableComponent from 'renderer/components/table/TableComponent';
import { useSnackbar } from 'notistack';
import { Entity } from 'renderer/entity/entity';
import { FormattedMessage } from 'react-intl';
import {
  EnrichedInstanceCacheRO,
  useGetInstanceCachesQuery,
} from 'renderer/apis/requests/instance/caches/getInstanceCaches';
import { instanceCacheEntity } from 'renderer/entity/entities/instanceCache.entity';
import { useEvictInstanceCaches } from 'renderer/apis/requests/instance/caches/evictInstanceCaches';
import { useEvictAllInstanceCaches } from 'renderer/apis/requests/instance/caches/evictAllInstanceCaches';
import { EVICT_CACHE_ID, STATISTICS_ID } from 'renderer/entity/actions';
import { Card } from '@mui/material';
import { InstanceRO } from '../../../../../common/generated_definitions';
import { useEvictInstanceCache } from '../../../../apis/requests/instance/caches/evictInstanceCache';
import NiceModal from '@ebay/nice-modal-react';
import QuartzTriggerDetailsDialog from '../quartz/components/QuartzTriggerDetailsDialog';
import CacheStatisticsDialog from './components/CacheStatisticsDialog';

const InstanceCaches: FunctionComponent = () => {
  const { selectedItem } = useNavigatorTree();
  const { enqueueSnackbar } = useSnackbar();

  const item = useMemo<InstanceRO>(() => selectedItem as InstanceRO, [selectedItem]);

  const entity = useMemo<Entity<EnrichedInstanceCacheRO>>(() => instanceCacheEntity, []);
  const queryState = useGetInstanceCachesQuery({ instanceId: item.id });

  const evictCacheState = useEvictInstanceCache();

  const actionsHandler = useCallback(async (actionId: string, row: EnrichedInstanceCacheRO): Promise<void> => {
    switch (actionId) {
      case STATISTICS_ID:
        await NiceModal.show<undefined>(CacheStatisticsDialog, {
          row: row,
        });
        break;
      case EVICT_CACHE_ID:
        try {
          await evictCacheState.mutateAsync({ instanceId: item.id, cacheName: row.name });
          enqueueSnackbar(<FormattedMessage id={'evictedCacheSuccessfully'} values={{ names: row.name }} />, {
            variant: 'success',
          });
        } catch (e) {}
        break;
      default:
        break;
    }
  }, []);

  const evictCachesState = useEvictInstanceCaches();

  const massActionsHandler = useCallback(
    async (actionId: string, selectedRows: EnrichedInstanceCacheRO[]): Promise<void> => {
      switch (actionId) {
        case EVICT_CACHE_ID:
          try {
            await evictCachesState.mutateAsync({
              instanceId: item.id,
              cacheNames: selectedRows.map((r) => r.name),
            });
            enqueueSnackbar(
              <FormattedMessage
                id={'evictedCacheSuccessfully'}
                values={{ names: selectedRows.map((r) => r.name).join(', ') }}
              />,
              {
                variant: 'success',
              }
            );
          } catch (e) {}
          break;
        default:
          break;
      }
    },
    []
  );

  const evictAllCachesState = useEvictAllInstanceCaches();

  const globalActionsHandler = useCallback(async (actionId: string): Promise<void> => {
    switch (actionId) {
      case EVICT_CACHE_ID:
        try {
          await evictAllCachesState.mutateAsync({ instanceId: item.id });
          enqueueSnackbar(<FormattedMessage id={'evictedAllCachesSuccessfully'} />, {
            variant: 'success',
          });
        } catch (e) {}
        break;
      default:
        break;
    }
  }, []);

  return (
    <Page>
      <Card>
        <TableComponent
          entity={entity}
          data={queryState.data}
          loading={queryState.isLoading}
          refetchHandler={queryState.refetch}
          actionsHandler={actionsHandler}
          massActionsHandler={massActionsHandler}
          globalActionsHandler={globalActionsHandler}
        />
      </Card>
    </Page>
  );
};

export default InstanceCaches;
