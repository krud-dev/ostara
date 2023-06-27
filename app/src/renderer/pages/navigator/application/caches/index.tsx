import React, { FunctionComponent, useCallback, useMemo } from 'react';
import Page from 'renderer/components/layout/Page';
import TableComponent from 'renderer/components/table/TableComponent';
import { useSnackbar } from 'notistack';
import { Entity } from 'renderer/entity/entity';
import { FormattedMessage } from 'react-intl';
import { EVICT_CACHE_ID, STATISTICS_ID } from 'renderer/entity/actions';
import { applicationCacheEntity } from 'renderer/entity/entities/applicationCache.entity';
import {
  EnrichedApplicationCacheRO,
  useGetApplicationCachesQuery,
} from 'renderer/apis/requests/application/caches/getApplicationCaches';
import { useEvictApplicationCaches } from 'renderer/apis/requests/application/caches/evictApplicationCaches';
import { useEvictAllApplicationCaches } from 'renderer/apis/requests/application/caches/evictAllApplicationCaches';
import { Card } from '@mui/material';
import { ApplicationRO } from 'common/generated_definitions';
import { useEvictApplicationCache } from 'renderer/apis/requests/application/caches/evictApplicationCache';
import NiceModal from '@ebay/nice-modal-react';
import ApplicationCacheStatisticsDialog, {
  ApplicationCacheStatisticsDialogProps,
} from 'renderer/pages/navigator/application/caches/components/ApplicationCacheStatisticsDialog';
import { useNavigatorLayoutContext } from 'renderer/contexts/NavigatorLayoutContext';

const ApplicationCaches: FunctionComponent = () => {
  const { selectedItem, selectedItemAbilities } = useNavigatorLayoutContext();
  const { enqueueSnackbar } = useSnackbar();

  const item = useMemo<ApplicationRO>(() => selectedItem as ApplicationRO, [selectedItem]);
  const hasStatisticsAbility = useMemo<boolean>(
    () => !!selectedItemAbilities?.includes('CACHE_STATISTICS'),
    [selectedItemAbilities]
  );

  const entity = useMemo<Entity<EnrichedApplicationCacheRO>>(() => applicationCacheEntity, []);
  const queryState = useGetApplicationCachesQuery({ applicationId: item.id, hasStatistics: hasStatisticsAbility });

  const evictCacheState = useEvictApplicationCache();

  const actionsHandler = useCallback(async (actionId: string, row: EnrichedApplicationCacheRO): Promise<void> => {
    switch (actionId) {
      case STATISTICS_ID:
        await NiceModal.show<undefined, ApplicationCacheStatisticsDialogProps>(ApplicationCacheStatisticsDialog, {
          row: row,
        });
        break;
      case EVICT_CACHE_ID:
        try {
          await evictCacheState.mutateAsync({ applicationId: item.id, cacheName: row.name });
          enqueueSnackbar(<FormattedMessage id={'evictedCacheSuccessfully'} values={{ names: row.name }} />, {
            variant: 'success',
          });
        } catch (e) {}
        break;
      default:
        break;
    }
  }, []);

  const evictCachesState = useEvictApplicationCaches();

  const massActionsHandler = useCallback(
    async (actionId: string, selectedRows: EnrichedApplicationCacheRO[]): Promise<void> => {
      switch (actionId) {
        case EVICT_CACHE_ID:
          try {
            await evictCachesState.mutateAsync({
              applicationId: item.id,
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

  const evictAllCachesState = useEvictAllApplicationCaches();

  const globalActionsHandler = useCallback(async (actionId: string): Promise<void> => {
    switch (actionId) {
      case EVICT_CACHE_ID:
        try {
          await evictAllCachesState.mutateAsync({ applicationId: item.id });
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

export default ApplicationCaches;
