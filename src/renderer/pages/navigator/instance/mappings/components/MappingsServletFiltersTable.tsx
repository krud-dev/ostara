import React, { FunctionComponent, useCallback, useMemo } from 'react';
import TableComponent from 'renderer/components/table/TableComponent';
import { Entity } from 'renderer/entity/entity';
import {
  EnrichedMappingsServletFilter,
  useGetInstanceMappingsServletFiltersQuery,
} from '../../../../../apis/requests/instance/mappings/getInstanceMappingsServletFilters';
import { instanceMappingsServletFilterEntity } from '../../../../../entity/entities/instanceMappingsServletFilterEntity';

type MappingsServletFiltersTableProps = {
  instanceId: string;
};

const MappingsServletFiltersTable: FunctionComponent<MappingsServletFiltersTableProps> = ({ instanceId }) => {
  const entity = useMemo<Entity<EnrichedMappingsServletFilter>>(() => instanceMappingsServletFilterEntity, []);
  const queryState = useGetInstanceMappingsServletFiltersQuery({ instanceId });

  const actionsHandler = useCallback(async (actionId: string, row: EnrichedMappingsServletFilter): Promise<void> => {},
  []);

  const massActionsHandler = useCallback(
    async (actionId: string, selectedRows: EnrichedMappingsServletFilter[]): Promise<void> => {},
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

export default MappingsServletFiltersTable;
