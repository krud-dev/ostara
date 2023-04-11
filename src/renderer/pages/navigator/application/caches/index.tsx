import React, { FunctionComponent, useCallback, useMemo } from 'react';
import Page from 'renderer/components/layout/Page';
import { useNavigatorTree } from 'renderer/contexts/NavigatorTreeContext';
import TableComponent from 'renderer/components/table/TableComponent';
import { useSnackbar } from 'notistack';
import { Entity } from 'renderer/entity/entity';
import { FormattedMessage } from 'react-intl';
import { EVICT_CACHE_ID } from 'renderer/entity/actions';
import { applicationCacheEntity } from 'renderer/entity/entities/applicationCache.entity';
import { useGetApplicationCachesQuery } from 'renderer/apis/requests/application/caches/getApplicationCaches';
import { useEvictApplicationCaches } from 'renderer/apis/requests/application/caches/evictApplicationCaches';
import { useEvictAllApplicationCaches } from 'renderer/apis/requests/application/caches/evictAllApplicationCaches';
import { Card } from '@mui/material';
import { ApplicationCacheRO, ApplicationRO } from '../../../../../common/generated_definitions';
import { useEvictApplicationCache } from '../../../../apis/requests/application/caches/evictApplicationCache';

const ApplicationCaches: FunctionComponent = () => {
  const { selectedItem } = useNavigatorTree();
  const { enqueueSnackbar } = useSnackbar();

  const item = useMemo<ApplicationRO | undefined>(() => selectedItem as ApplicationRO | undefined, [selectedItem]);
  const itemId = useMemo<string>(() => item?.id || '', [item]);

  const entity = useMemo<Entity<ApplicationCacheRO>>(() => applicationCacheEntity, []);
  const queryState = useGetApplicationCachesQuery({ applicationId: itemId });

  const evictCacheState = useEvictApplicationCache();

  const actionsHandler = useCallback(async (actionId: string, row: ApplicationCacheRO): Promise<void> => {
    switch (actionId) {
      case EVICT_CACHE_ID:
        try {
          await evictCacheState.mutateAsync({ applicationId: itemId, cacheName: row.name });
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
    async (actionId: string, selectedRows: ApplicationCacheRO[]): Promise<void> => {
      switch (actionId) {
        case EVICT_CACHE_ID:
          try {
            await evictCachesState.mutateAsync({
              applicationId: itemId,
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
          await evictAllCachesState.mutateAsync({ applicationId: itemId });
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
