import React, { FunctionComponent, useCallback, useMemo } from 'react';
import Page from 'renderer/components/layout/Page';
import { useNavigatorTree } from 'renderer/contexts/NavigatorTreeContext';
import { EnrichedApplication, EnrichedInstance } from 'infra/configuration/model/configuration';
import TableComponent from 'renderer/components/table/TableComponent';
import { Entity } from 'renderer/entity/entity';
import { useGetApplicationInstancesQuery } from 'renderer/apis/application/getApplicationInstances';
import { applicationInstance } from 'renderer/entity/entities/applicationInstance.entity';

const ApplicationInstances: FunctionComponent = () => {
  const { selectedItem } = useNavigatorTree();

  const item = useMemo<EnrichedApplication | undefined>(
    () => selectedItem as EnrichedApplication | undefined,
    [selectedItem]
  );
  const itemId = useMemo<string>(() => item?.id || '', [item]);

  const entity = useMemo<Entity<EnrichedInstance>>(() => applicationInstance, []);
  const queryState = useGetApplicationInstancesQuery({ applicationId: itemId });

  const actionsHandler = useCallback(async (actionId: string, row: EnrichedInstance): Promise<void> => {}, []);

  const massActionsHandler = useCallback(
    async (actionId: string, selectedRows: EnrichedInstance[]): Promise<void> => {},
    []
  );

  const globalActionsHandler = useCallback(async (actionId: string): Promise<void> => {}, []);

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

export default ApplicationInstances;
