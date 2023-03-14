import React, { FunctionComponent, useMemo } from 'react';
import Page from 'renderer/components/layout/Page';
import { useNavigatorTree } from 'renderer/contexts/NavigatorTreeContext';
import { Card } from '@mui/material';
import { FormattedMessage } from 'react-intl';
import TabPanel, { TabInfo } from 'renderer/components/layout/TabPanel';
import { InstanceRO } from '../../../../../common/generated_definitions';
import MappingsServletsTable from './components/MappingsServletsTable';
import MappingsServletFiltersTable from './components/MappingsServletFiltersTable';
import MappingsDispatcherServletsTable from './components/MappingsDispatcherServletsTable';
import MappingsDispatcherHandlersTable from './components/MappingsDispatcherHandlersTable';

const InstanceMappings: FunctionComponent = () => {
  const { selectedItem } = useNavigatorTree();

  const item = useMemo<InstanceRO>(() => selectedItem as InstanceRO, [selectedItem]);

  const tabs = useMemo<TabInfo[]>(
    () => [
      {
        id: 'servlets',
        label: <FormattedMessage id={'servlets'} />,
        lazy: true,
      },
      {
        id: 'servletFilters',
        label: <FormattedMessage id={'servletFilters'} />,
        lazy: true,
      },
      {
        id: 'dispatcherServlets',
        label: <FormattedMessage id={'dispatcherServlets'} />,
        lazy: true,
      },
      {
        id: 'dispatcherHandlers',
        label: <FormattedMessage id={'dispatcherHandlers'} />,
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
          <MappingsServletsTable instanceId={item.id} />
          <MappingsServletFiltersTable instanceId={item.id} />
          <MappingsDispatcherServletsTable instanceId={item.id} />
          <MappingsDispatcherHandlersTable instanceId={item.id} />
        </TabPanel>
      </Card>
    </Page>
  );
};

export default InstanceMappings;
