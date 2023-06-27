import React, { FunctionComponent, useMemo } from 'react';
import Page from 'renderer/components/layout/Page';
import { useNavigatorLayoutContext } from 'renderer/contexts/NavigatorLayoutContext';
import { Card } from '@mui/material';
import { FormattedMessage } from 'react-intl';
import TabPanel, { TabInfo } from 'renderer/components/layout/TabPanel';
import { InstanceRO } from 'common/generated_definitions';
import QuartzJobsTable from './components/QuartzJobsTable';
import QuartzTriggersTable from './components/QuartzTriggersTable';

const InstanceQuartz: FunctionComponent = () => {
  const { selectedItem } = useNavigatorLayoutContext();

  const item = useMemo<InstanceRO>(() => selectedItem as InstanceRO, [selectedItem]);

  const tabs = useMemo<TabInfo[]>(
    () => [
      {
        id: 'jobs',
        label: <FormattedMessage id={'jobs'} />,
        lazy: true,
      },
      {
        id: 'triggers',
        label: <FormattedMessage id={'triggers'} />,
        lazy: true,
      },
    ],
    []
  );

  return (
    <Page>
      <Card>
        <TabPanel
          tabs={tabs}
          sx={{ backgroundColor: (theme) => theme.palette.background.neutral }}
          sxTabContainer={{ backgroundColor: (theme) => theme.palette.background.paper }}
        >
          <QuartzJobsTable instanceId={item.id} />
          <QuartzTriggersTable instanceId={item.id} />
        </TabPanel>
      </Card>
    </Page>
  );
};

export default InstanceQuartz;
