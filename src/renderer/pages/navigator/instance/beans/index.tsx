import React, { FunctionComponent, useCallback, useMemo } from 'react';
import Page from 'renderer/components/layout/Page';
import { useNavigatorTree } from 'renderer/contexts/NavigatorTreeContext';
import TableComponent from 'renderer/components/table/TableComponent';
import { Entity } from 'renderer/entity/entity';
import { instanceBeanEntity } from 'renderer/entity/entities/instanceBean.entity';
import { InstanceBean, useGetInstanceBeansQuery } from 'renderer/apis/instance/getInstanceBeans';
import { Card } from '@mui/material';
import { InstanceRO } from '../../../../../common/generated_definitions';

const InstanceBeans: FunctionComponent = () => {
  const { selectedItem } = useNavigatorTree();

  const item = useMemo<InstanceRO>(() => selectedItem as InstanceRO, [selectedItem]);

  const entity = useMemo<Entity<InstanceBean>>(() => instanceBeanEntity, []);
  const queryState = useGetInstanceBeansQuery({ instanceId: item.id });

  const actionsHandler = useCallback(async (actionId: string, row: InstanceBean): Promise<void> => {}, []);

  const massActionsHandler = useCallback(async (actionId: string, selectedRows: InstanceBean[]): Promise<void> => {},
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

export default InstanceBeans;
