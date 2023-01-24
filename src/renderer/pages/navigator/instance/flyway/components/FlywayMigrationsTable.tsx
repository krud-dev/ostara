import React, { FunctionComponent, useCallback, useMemo } from 'react';
import Page from 'renderer/components/layout/Page';
import TableComponent from 'renderer/components/table/TableComponent';
import { Entity } from 'renderer/entity/entity';
import {
  EnrichedActuatorFlywayMigration,
  useGetInstanceFlywayMigrationsQuery,
} from 'renderer/apis/instance/getInstanceFlywayMigrations';
import { instanceFlywayMigrationEntity } from 'renderer/entity/entities/instanceFlywayMigration.entity';

type FlywayMigrationsTableProps = {
  instanceId: string;
  context: string;
};

const FlywayMigrationsTable: FunctionComponent<FlywayMigrationsTableProps> = ({ instanceId, context }) => {
  const entity = useMemo<Entity<EnrichedActuatorFlywayMigration>>(() => instanceFlywayMigrationEntity, []);
  const queryState = useGetInstanceFlywayMigrationsQuery({ instanceId, context });

  const actionsHandler = useCallback(
    async (actionId: string, row: EnrichedActuatorFlywayMigration): Promise<void> => {},
    []
  );

  const massActionsHandler = useCallback(
    async (actionId: string, selectedRows: EnrichedActuatorFlywayMigration[]): Promise<void> => {},
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

export default FlywayMigrationsTable;
