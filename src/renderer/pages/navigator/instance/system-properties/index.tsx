import React, { FunctionComponent, useCallback, useMemo } from 'react';
import Page from 'renderer/components/layout/Page';
import { useNavigatorTree } from 'renderer/contexts/NavigatorTreeContext';
import { Entity } from 'renderer/entity/entity';
import TableComponent from 'renderer/components/table/TableComponent';
import { useGetInstanceEnvPropertiesQuery } from 'renderer/apis/requests/instance/env/getInstanceEnvProperties';
import useCopyToClipboard from 'renderer/hooks/useCopyToClipboard';
import { COPY_ID } from 'renderer/entity/actions';
import { Card } from '@mui/material';
import { InstanceRO } from '../../../../../common/generated_definitions';
import { SystemProperty } from '../../../../apis/requests/instance/env/getInstanceSystemProperties';
import { instanceSystemPropertyEntity } from '../../../../entity/entities/instanceSystemProperty.entity';

const InstanceSystemProperties: FunctionComponent = () => {
  const { selectedItem } = useNavigatorTree();
  const copyToClipboard = useCopyToClipboard();

  const item = useMemo<InstanceRO>(() => selectedItem as InstanceRO, [selectedItem]);

  const entity = useMemo<Entity<SystemProperty>>(() => instanceSystemPropertyEntity, []);
  const queryState = useGetInstanceEnvPropertiesQuery({ instanceId: item.id });

  const getPropertyString = useCallback((property: SystemProperty): string => {
    return property.value;
  }, []);

  const actionsHandler = useCallback(async (actionId: string, row: SystemProperty): Promise<void> => {
    switch (actionId) {
      case COPY_ID:
        copyToClipboard(getPropertyString(row));
        break;
      default:
        break;
    }
  }, []);

  const massActionsHandler = useCallback(async (actionId: string, selectedRows: SystemProperty[]): Promise<void> => {
    switch (actionId) {
      case COPY_ID:
        copyToClipboard(selectedRows.map(getPropertyString).join(', '));
        break;
      default:
        break;
    }
  }, []);

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

export default InstanceSystemProperties;
