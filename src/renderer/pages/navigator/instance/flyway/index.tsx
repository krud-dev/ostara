import React, { FunctionComponent, useMemo } from 'react';
import Page from 'renderer/components/layout/Page';
import { useNavigatorTree } from 'renderer/contexts/NavigatorTreeContext';
import { Box, Card, CircularProgress } from '@mui/material';
import { isEmpty, map } from 'lodash';
import EmptyContent from 'renderer/components/help/EmptyContent';
import { FormattedMessage } from 'react-intl';
import TabPanel, { TabInfo } from 'renderer/components/layout/TabPanel';
import { useGetInstanceFlywayQuery } from 'renderer/apis/instance/getInstanceFlyway';
import FlywayMigrationsTable from 'renderer/pages/navigator/instance/flyway/components/FlywayMigrationsTable';
import { InstanceRO } from '../../../../../common/generated_definitions';

const InstanceFlyway: FunctionComponent = () => {
  const { selectedItem } = useNavigatorTree();

  const item = useMemo<InstanceRO>(() => selectedItem as InstanceRO, [selectedItem]);

  const contextsState = useGetInstanceFlywayQuery({ instanceId: item.id });

  const loading = useMemo<boolean>(() => contextsState.isLoading, [contextsState]);
  const empty = useMemo<boolean>(() => !loading && isEmpty(contextsState.data), [loading, contextsState]);

  const tabs = useMemo<TabInfo[] | undefined>(
    () =>
      contextsState.data
        ? map(contextsState.data.contexts, (context, contextKey) => ({ id: contextKey, label: contextKey, lazy: true }))
        : undefined,
    [contextsState.data]
  );

  return (
    <Page>
      {loading && (
        <Box sx={{ textAlign: 'center' }}>
          <CircularProgress />
        </Box>
      )}

      {empty && <EmptyContent text={<FormattedMessage id={'noData'} />} />}

      {tabs && (
        <Card>
          <TabPanel
            tabs={tabs}
            sx={{ backgroundColor: (theme) => theme.palette.background.neutral }}
            sxTabContainer={{ backgroundColor: (theme) => theme.palette.background.paper }}
          >
            {tabs.map((tab) => (
              <FlywayMigrationsTable instanceId={item.id} context={tab.id} key={tab.id} />
            ))}
          </TabPanel>
        </Card>
      )}
    </Page>
  );
};

export default InstanceFlyway;
