import React, { FunctionComponent, useCallback, useMemo } from 'react';
import TableComponent from 'renderer/components/table/TableComponent';
import { Entity } from 'renderer/entity/entity';
import {
  EnrichedMappingsServlet,
  useGetInstanceMappingsServletsQuery,
} from '../../../../../apis/requests/instance/mappings/getInstanceMappingsServlets';
import { instanceMappingsServletEntity } from '../../../../../entity/entities/instanceMappingsServletEntity';

type MappingsServletsTableProps = {
  instanceId: string;
};

const MappingsServletsTable: FunctionComponent<MappingsServletsTableProps> = ({ instanceId }) => {
  const entity = useMemo<Entity<EnrichedMappingsServlet>>(() => instanceMappingsServletEntity, []);
  const queryState = useGetInstanceMappingsServletsQuery({ instanceId });

  const actionsHandler = useCallback(async (actionId: string, row: EnrichedMappingsServlet): Promise<void> => {}, []);

  const massActionsHandler = useCallback(
    async (actionId: string, selectedRows: EnrichedMappingsServlet[]): Promise<void> => {},
    []
  );

  const globalActionsHandler = useCallback(async (actionId: string): Promise<void> => {}, []);

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

export default MappingsServletsTable;
