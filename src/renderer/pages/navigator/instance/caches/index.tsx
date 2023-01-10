import React, { FunctionComponent, useCallback, useMemo } from 'react';
import Page from 'renderer/components/layout/Page';
import { useNavigatorTree } from 'renderer/contexts/NavigatorTreeContext';
import { EnrichedInstance } from 'infra/configuration/model/configuration';
import TableComponent from 'renderer/components/table/TableComponent';
import { useSnackbar } from 'notistack';
import { Entity } from 'renderer/entity/entity';
import { RUN_TASK_ID } from 'renderer/entity/entities/task.entity';
import { useRunTask } from 'renderer/apis/tasks/runTask';
import { FormattedMessage } from 'react-intl';
import { useGetInstanceCachesQuery } from 'renderer/apis/instance/getInstanceCaches';
import { InstanceCache } from 'infra/instance/models/cache';
import { EVICT_CACHE_ID, instanceCacheEntity } from 'renderer/entity/entities/instanceCache.entity';
import { useEvictInstanceCaches } from 'renderer/apis/instance/evictInstanceCaches';
import { useEvictAllInstanceCaches } from 'renderer/apis/instance/evictAllInstanceCaches';

const InstanceCaches: FunctionComponent = () => {
  const { selectedItem } = useNavigatorTree();
  const { enqueueSnackbar } = useSnackbar();

  const item = useMemo<EnrichedInstance | undefined>(
    () => selectedItem as EnrichedInstance | undefined,
    [selectedItem]
  );
  const itemId = useMemo<string>(() => item?.id || '', [item]);

  const entity = useMemo<Entity<InstanceCache>>(() => instanceCacheEntity, []);
  const queryState = useGetInstanceCachesQuery({ instanceId: itemId }, { enabled: !!itemId });

  const evictInstanceCachesState = useEvictInstanceCaches();
  const evictAllInstanceCachesState = useEvictAllInstanceCaches();

  const actionsHandler = useCallback(async (actionId: string, row: InstanceCache): Promise<void> => {
    switch (actionId) {
      case EVICT_CACHE_ID:
        try {
          await evictInstanceCachesState.mutateAsync({ instanceId: itemId, cacheNames: [row.name] });
          enqueueSnackbar(<FormattedMessage id={'evictedCacheSuccessfully'} values={{ names: row.name }} />, {
            variant: 'success',
          });
        } catch (e) {}
        break;
      default:
        break;
    }
  }, []);

  const massActionsHandler = useCallback(async (actionId: string, selectedRows: InstanceCache[]): Promise<void> => {
    switch (actionId) {
      case EVICT_CACHE_ID:
        try {
          await evictInstanceCachesState.mutateAsync({
            instanceId: itemId,
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
  }, []);

  const globalActionsHandler = useCallback(async (actionId: string): Promise<void> => {
    switch (actionId) {
      case EVICT_CACHE_ID:
        try {
          await evictAllInstanceCachesState.mutateAsync({ instanceId: itemId });
          enqueueSnackbar(<FormattedMessage id={'evictedAllCachesSuccessfully'} />, {
            variant: 'success',
          });
        } catch (e) {}
        break;
      default:
        break;
    }
  }, []);

  if (!item) {
    return null;
  }

  return (
    <Page>
      <TableComponent
        entity={entity}
        queryState={queryState}
        actionsHandler={actionsHandler}
        massActionsHandler={massActionsHandler}
        globalActionsHandler={globalActionsHandler}
      />
    </Page>
  );
};

export default InstanceCaches;