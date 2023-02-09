import React, { FunctionComponent, useCallback, useMemo } from 'react';
import Page from 'renderer/components/layout/Page';
import { useNavigatorTree } from 'renderer/contexts/NavigatorTreeContext';
import TableComponent from 'renderer/components/table/TableComponent';
import { Entity } from 'renderer/entity/entity';
import { useGetApplicationInstancesQuery } from 'renderer/apis/application/getApplicationInstances';
import { applicationInstanceEntity } from 'renderer/entity/entities/applicationInstance.entity';
import { Card } from '@mui/material';
import { ApplicationRO, InstanceRO } from '../../../../../common/generated_definitions';

const ApplicationInstances: FunctionComponent = () => {
  const { selectedItem } = useNavigatorTree();

  const item = useMemo<ApplicationRO | undefined>(() => selectedItem as ApplicationRO | undefined, [selectedItem]);
  const itemId = useMemo<string>(() => item?.id || '', [item]);

  const entity = useMemo<Entity<InstanceRO>>(() => applicationInstanceEntity, []);
  const queryState = useGetApplicationInstancesQuery({ applicationId: itemId });

  const actionsHandler = useCallback(async (actionId: string, row: InstanceRO): Promise<void> => {}, []);

  const massActionsHandler = useCallback(async (actionId: string, selectedRows: InstanceRO[]): Promise<void> => {}, []);

  const globalActionsHandler = useCallback(async (actionId: string): Promise<void> => {}, []);

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

export default ApplicationInstances;
