import React, { FunctionComponent, useMemo } from 'react';
import Page from 'renderer/components/layout/Page';
import { useNavigatorTree } from 'renderer/contexts/NavigatorTreeContext';
import { Box, Card } from '@mui/material';
import { InstanceRO } from '../../../../../common/generated_definitions';
import { useGetInstanceTogglzQuery } from '../../../../apis/requests/instance/togglz/getInstanceTogglz';
import { chain, isEmpty } from 'lodash';
import TabPanel, { TabInfo } from '../../../../components/layout/TabPanel';
import LogoLoader from '../../../../components/common/LogoLoader';
import EmptyContent from '../../../../components/help/EmptyContent';
import { FormattedMessage } from 'react-intl';
import TogglzGroupTable from './components/TogglzGroupTable';

type GroupTabInfo = TabInfo & { group?: string };

const InstanceTogglz: FunctionComponent = () => {
  const { selectedItem } = useNavigatorTree();

  const item = useMemo<InstanceRO>(() => selectedItem as InstanceRO, [selectedItem]);

  const groupsState = useGetInstanceTogglzQuery({ instanceId: item.id });

  const loading = useMemo<boolean>(() => groupsState.isLoading, [groupsState]);
  const empty = useMemo<boolean>(() => !loading && isEmpty(groupsState.data), [loading, groupsState]);

  const tabs = useMemo<GroupTabInfo[] | undefined>(
    () =>
      groupsState.data
        ? [
            { id: 'all', label: <FormattedMessage id={'all'} />, lazy: true, group: undefined },
            ...chain(groupsState.data)
              .map((togglz) => togglz.metadata?.groups || [])
              .flatten()
              .uniq()
              .map<TabInfo>((group) => ({ id: `group_${group}`, label: group, lazy: true, group: group }))
              .value(),
          ]
        : undefined,
    [groupsState.data]
  );

  return (
    <Page sx={{ height: '100%' }}>
      {loading && (
        <Box sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <LogoLoader />
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
              <TogglzGroupTable instanceId={item.id} group={tab.group} key={tab.id} />
            ))}
          </TabPanel>
        </Card>
      )}
    </Page>
  );
};

export default InstanceTogglz;
