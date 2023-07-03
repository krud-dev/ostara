import React, { FunctionComponent, useCallback, useMemo } from 'react';
import Page from 'renderer/components/layout/Page';
import TableComponent from 'renderer/components/table/TableComponent';
import { Entity } from 'renderer/entity/entity';
import { Box, Card } from '@mui/material';
import { AgentRO, ApplicationRO } from 'common/generated_definitions';
import { folderApplicationEntity } from 'renderer/entity/entities/folderApplication.entity';
import { useItemsContext } from 'renderer/contexts/ItemsContext';
import { FormattedMessage } from 'react-intl';
import { useNavigatorLayoutContext } from 'renderer/contexts/NavigatorLayoutContext';

const AgentApplications: FunctionComponent = () => {
  const { applications, refetchApplications } = useItemsContext();
  const { selectedItem, data: navigatorData } = useNavigatorLayoutContext();

  const item = useMemo<AgentRO>(() => selectedItem as AgentRO, [selectedItem]);

  const entity = useMemo<Entity<ApplicationRO>>(() => folderApplicationEntity, []);
  const data = useMemo<ApplicationRO[] | undefined>(
    () => applications?.filter((a) => a.parentAgentId === item.id),
    [applications, item]
  );
  const loading = useMemo<boolean>(() => !data, [data]);

  const actionsHandler = useCallback(async (actionId: string, row: ApplicationRO): Promise<void> => {}, []);

  const massActionsHandler = useCallback(async (actionId: string, selectedRows: ApplicationRO[]): Promise<void> => {},
  []);

  const globalActionsHandler = useCallback(async (actionId: string): Promise<void> => {}, []);

  return (
    <Page>
      <Card>
        <TableComponent
          entity={entity}
          data={data}
          loading={loading}
          emptyContent={<FormattedMessage id={'agentsDescription'} />}
          refetchHandler={refetchApplications}
          actionsHandler={actionsHandler}
          massActionsHandler={massActionsHandler}
          globalActionsHandler={globalActionsHandler}
        />
      </Card>
    </Page>
  );
};

export default AgentApplications;
