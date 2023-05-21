import React, { FunctionComponent, useCallback, useMemo } from 'react';
import TableComponent from 'renderer/components/table/TableComponent';
import { Entity } from 'renderer/entity/entity';
import { TogglzFeatureActuatorResponse } from '../../../../../../common/generated_definitions';
import {
  EnrichedTogglzFeature,
  useGetInstanceTogglzQuery,
} from '../../../../../apis/requests/instance/togglz/getInstanceTogglz';
import { instanceTogglzEntity } from '../../../../../entity/entities/instanceTogglz.entity';
import { DISABLE_ID, ENABLE_ID } from '../../../../../entity/actions';
import { isItemDeletable } from '../../../../../utils/itemUtils';
import { crudKeys } from '../../../../../apis/requests/crud/crudKeys';
import { folderCrudEntity } from '../../../../../apis/requests/crud/entity/entities/folder.crudEntity';
import { applicationCrudEntity } from '../../../../../apis/requests/crud/entity/entities/application.crudEntity';
import { instanceCrudEntity } from '../../../../../apis/requests/crud/entity/entities/instance.crudEntity';
import { useUpdateInstanceTogglzFeature } from '../../../../../apis/requests/instance/togglz/updateInstanceTogglzFeature';
import { useQueryClient } from '@tanstack/react-query';
import { apiKeys } from '../../../../../apis/apiKeys';

type TogglzGroupTableProps = {
  instanceId: string;
  group?: string;
};

const TogglzGroupTable: FunctionComponent<TogglzGroupTableProps> = ({ instanceId, group }) => {
  const queryClient = useQueryClient();

  const entity = useMemo<Entity<EnrichedTogglzFeature>>(() => instanceTogglzEntity, []);
  const queryState = useGetInstanceTogglzQuery({ instanceId: instanceId, group: group });

  const actionsHandler = useCallback(async (actionId: string, row: TogglzFeatureActuatorResponse): Promise<void> => {
    switch (actionId) {
      default:
        break;
    }
  }, []);

  const massActionsHandler = useCallback(
    async (actionId: string, selectedRows: EnrichedTogglzFeature[]): Promise<void> => {},
    []
  );

  const updateTogglzState = useUpdateInstanceTogglzFeature({ refetchNone: true });

  const toggleAllHandler = useCallback(
    async (enabled: boolean): Promise<void> => {
      if (!queryState.data) {
        return;
      }

      try {
        const promises = queryState.data.map((togglz) =>
          updateTogglzState.mutateAsync({
            instanceId: togglz.instanceId,
            featureName: togglz.name,
            enabled: enabled,
          })
        );
        const result = await Promise.all(promises);
        if (result) {
          await queryClient.invalidateQueries(apiKeys.itemTogglz(instanceId));
        }
      } catch (e) {}
    },
    [queryState]
  );

  const globalActionsHandler = useCallback(
    async (actionId: string): Promise<void> => {
      switch (actionId) {
        case DISABLE_ID:
          await toggleAllHandler(false);
          break;
        case ENABLE_ID:
          await toggleAllHandler(true);
          break;
        default:
          break;
      }
    },
    [toggleAllHandler]
  );

  return (
    <TableComponent
      entity={entity}
      data={queryState.data}
      loading={queryState.isLoading}
      refetchHandler={queryState.refetch}
      actionsHandler={actionsHandler}
      massActionsHandler={massActionsHandler}
      globalActionsHandler={globalActionsHandler}
    />
  );
};

export default TogglzGroupTable;
