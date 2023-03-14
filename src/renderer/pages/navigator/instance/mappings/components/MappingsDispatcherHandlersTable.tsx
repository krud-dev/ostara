import React, { FunctionComponent, useCallback, useMemo } from 'react';
import TableComponent from 'renderer/components/table/TableComponent';
import { Entity } from 'renderer/entity/entity';
import { EnrichedMappingsDispatcherServletOrHandler } from '../../../../../apis/requests/instance/mappings/getInstanceMappingsDispatcherServlets';
import { instanceMappingsDispatcherServletOrHandlerEntity } from '../../../../../entity/entities/instanceMappingsDispatcherServletOrHandlerEntity';
import { useGetInstanceMappingsDispatcherHandlersQuery } from '../../../../../apis/requests/instance/mappings/getInstanceMappingsDispatcherHandlers';

type MappingsDispatcherHandlersTableProps = {
  instanceId: string;
};

const MappingsDispatcherHandlersTable: FunctionComponent<MappingsDispatcherHandlersTableProps> = ({ instanceId }) => {
  const entity = useMemo<Entity<EnrichedMappingsDispatcherServletOrHandler>>(
    () => instanceMappingsDispatcherServletOrHandlerEntity,
    []
  );
  const queryState = useGetInstanceMappingsDispatcherHandlersQuery({ instanceId });

  const actionsHandler = useCallback(
    async (actionId: string, row: EnrichedMappingsDispatcherServletOrHandler): Promise<void> => {},
    []
  );

  const massActionsHandler = useCallback(
    async (actionId: string, selectedRows: EnrichedMappingsDispatcherServletOrHandler[]): Promise<void> => {},
    []
  );

  const globalActionsHandler = useCallback(async (actionId: string): Promise<void> => {}, []);

  return (
    <TableComponent
      entity={entity}
      queryState={queryState}
      actionsHandler={actionsHandler}
      massActionsHandler={massActionsHandler}
      globalActionsHandler={globalActionsHandler}
    />
  );
};

export default MappingsDispatcherHandlersTable;
