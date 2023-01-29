import React, { FunctionComponent, useCallback, useMemo } from 'react';
import Page from 'renderer/components/layout/Page';
import { useNavigatorTree } from 'renderer/contexts/NavigatorTreeContext';
import { EnrichedApplication } from 'infra/configuration/model/configuration';
import TableComponent from 'renderer/components/table/TableComponent';
import { useSnackbar } from 'notistack';
import { Entity } from 'renderer/entity/entity';
import { FormattedMessage } from 'react-intl';
import { ApplicationCache } from 'infra/instance/models/cache';
import { EVICT_CACHE_ID } from 'renderer/entity/actions';
import { applicationCacheEntity } from 'renderer/entity/entities/applicationCache.entity';
import { EnrichedApplicationCache, useGetApplicationCachesQuery } from 'renderer/apis/application/getApplicationCaches';
import { useEvictApplicationCaches } from 'renderer/apis/application/evictApplicationCaches';
import { useEvictAllApplicationCaches } from 'renderer/apis/application/evictAllApplicationCaches';
import { Card } from '@mui/material';

const ApplicationCaches: FunctionComponent = () => {
  const { selectedItem } = useNavigatorTree();
  const { enqueueSnackbar } = useSnackbar();

  const item = useMemo<EnrichedApplication | undefined>(
    () => selectedItem as EnrichedApplication | undefined,
    [selectedItem]
  );
  const itemId = useMemo<string>(() => item?.id || '', [item]);

  const entity = useMemo<Entity<EnrichedApplicationCache>>(() => applicationCacheEntity, []);
  const queryState = useGetApplicationCachesQuery({ applicationId: itemId });

  const evictCachesState = useEvictApplicationCaches();
  const evictAllCachesState = useEvictAllApplicationCaches();

  const actionsHandler = useCallback(async (actionId: string, row: EnrichedApplicationCache): Promise<void> => {
    switch (actionId) {
      case EVICT_CACHE_ID:
        try {
          await evictCachesState.mutateAsync({ applicationId: itemId, cacheNames: [row.name] });
          enqueueSnackbar(<FormattedMessage id={'evictedCacheSuccessfully'} values={{ names: row.name }} />, {
            variant: 'success',
          });
        } catch (e) {}
        break;
      default:
        break;
    }
  }, []);

  const massActionsHandler = useCallback(
    async (actionId: string, selectedRows: EnrichedApplicationCache[]): Promise<void> => {
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
          queryState={queryState}
          actionsHandler={actionsHandler}
          massActionsHandler={massActionsHandler}
          globalActionsHandler={globalActionsHandler}
        />
      </Card>
    </Page>
  );
};

export default ApplicationCaches;
