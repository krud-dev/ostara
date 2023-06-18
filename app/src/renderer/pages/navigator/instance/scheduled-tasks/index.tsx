import React, { FunctionComponent, useMemo } from 'react';
import Page from 'renderer/components/layout/Page';
import { useNavigatorLayout } from 'renderer/contexts/NavigatorLayoutContext';
import { Card } from '@mui/material';
import { FormattedMessage } from 'react-intl';
import TabPanel, { TabInfo } from 'renderer/components/layout/TabPanel';
import { InstanceRO } from '../../../../../common/generated_definitions';
import ScheduledTasksCronTable from './components/ScheduledTasksCronTable';
import ScheduledTasksFixedTable from './components/ScheduledTasksFixedTable';
import ScheduledTasksCustomTable from './components/ScheduledTasksCustomTable';

const InstanceScheduledTasks: FunctionComponent = () => {
  const { selectedItem } = useNavigatorLayout();

  const item = useMemo<InstanceRO>(() => selectedItem as InstanceRO, [selectedItem]);

  const tabs = useMemo<TabInfo[]>(
    () => [
      {
        id: 'cron',
        label: <FormattedMessage id={'cron'} />,
        lazy: true,
      },
      {
        id: 'fixedDelay',
        label: <FormattedMessage id={'fixedDelay'} />,
        lazy: true,
      },
      {
        id: 'fixedRate',
        label: <FormattedMessage id={'fixedRate'} />,
        lazy: true,
      },
      {
        id: 'custom',
        label: <FormattedMessage id={'custom'} />,
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
          <ScheduledTasksCronTable instanceId={item.id} />
          <ScheduledTasksFixedTable instanceId={item.id} type={'Delay'} />
          <ScheduledTasksFixedTable instanceId={item.id} type={'Rate'} />
          <ScheduledTasksCustomTable instanceId={item.id} />
        </TabPanel>
      </Card>
    </Page>
  );
};

export default InstanceScheduledTasks;
