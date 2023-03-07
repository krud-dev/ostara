import React, { FunctionComponent, useCallback, useMemo } from 'react';
import Page from 'renderer/components/layout/Page';
import { useNavigatorTree } from 'renderer/contexts/NavigatorTreeContext';
import { Entity } from 'renderer/entity/entity';
import TableComponent from 'renderer/components/table/TableComponent';
import useCopyToClipboard from 'renderer/hooks/useCopyToClipboard';
import { COPY_ID } from 'renderer/entity/actions';
import { Card } from '@mui/material';
import { InstanceRO } from '../../../../../common/generated_definitions';
import { SystemProperty } from '../../../../apis/requests/instance/env/getInstanceSystemProperties';
import {
  SystemEnvironmentProperty,
  useGetInstanceSystemEnvironmentQuery,
} from '../../../../apis/requests/instance/env/getInstanceSystemEnvironment';
import { instanceSystemEnvironmentEntity } from '../../../../entity/entities/instanceSystemEnvironment.entity';

const InstanceSystemEnvironment: FunctionComponent = () => {
  const { selectedItem } = useNavigatorTree();
  const copyToClipboard = useCopyToClipboard();

  const item = useMemo<InstanceRO>(() => selectedItem as InstanceRO, [selectedItem]);

  const entity = useMemo<Entity<SystemEnvironmentProperty>>(() => instanceSystemEnvironmentEntity, []);
  const queryState = useGetInstanceSystemEnvironmentQuery({ instanceId: item.id });

  const getPropertyString = useCallback((property: SystemEnvironmentProperty): string => {
    return property.value;
  }, []);

  const actionsHandler = useCallback(async (actionId: string, row: SystemEnvironmentProperty): Promise<void> => {
    switch (actionId) {
      case COPY_ID:
        copyToClipboard(getPropertyString(row));
        break;
      default:
        break;
    }
  }, []);

  const massActionsHandler = useCallback(async (actionId: string, selectedRows: SystemProperty[]): Promise<void> => {},
  []);

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

export default InstanceSystemEnvironment;
