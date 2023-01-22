import React, { FunctionComponent, useCallback, useMemo } from 'react';
import Page from 'renderer/components/layout/Page';
import { useNavigatorTree } from 'renderer/contexts/NavigatorTreeContext';
import { EnrichedInstance } from 'infra/configuration/model/configuration';
import TableComponent from 'renderer/components/table/TableComponent';
import { Entity } from 'renderer/entity/entity';
import { instanceBeanEntity } from 'renderer/entity/entities/instanceBean.entity';
import { InstanceBean, useGetInstanceBeansQuery } from 'renderer/apis/instance/getInstanceBeans';
import { COPY_ID } from 'renderer/entity/actions';
import useCopyToClipboard from 'renderer/hooks/useCopyToClipboard';

const InstanceBeans: FunctionComponent = () => {
  const { selectedItem } = useNavigatorTree();

  const item = useMemo<EnrichedInstance | undefined>(
    () => selectedItem as EnrichedInstance | undefined,
    [selectedItem]
  );
  const itemId = useMemo<string>(() => item?.id || '', [item]);

  const entity = useMemo<Entity<InstanceBean>>(() => instanceBeanEntity, []);
  const queryState = useGetInstanceBeansQuery({ instanceId: itemId });

  const actionsHandler = useCallback(async (actionId: string, row: InstanceBean): Promise<void> => {}, []);

  const massActionsHandler = useCallback(async (actionId: string, selectedRows: InstanceBean[]): Promise<void> => {},
  []);

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

export default InstanceBeans;