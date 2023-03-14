import React, { FunctionComponent, useMemo } from 'react';
import Page from 'renderer/components/layout/Page';
import { useNavigatorTree } from 'renderer/contexts/NavigatorTreeContext';
import { Box, Card } from '@mui/material';
import { useGetInstancePropertiesQuery } from 'renderer/apis/requests/instance/properties/getInstanceProperties';
import { isEmpty, map } from 'lodash';
import EmptyContent from 'renderer/components/help/EmptyContent';
import { FormattedMessage } from 'react-intl';
import InstancePropertiesCode from 'renderer/pages/navigator/instance/properties/components/InstancePropertiesCode';
import TabPanel, { TabInfo } from 'renderer/components/layout/TabPanel';
import { InstanceRO } from '../../../../../common/generated_definitions';
import LogoLoader from '../../../../components/common/LogoLoader';

const InstanceProperties: FunctionComponent = () => {
  const { selectedItem } = useNavigatorTree();

  const item = useMemo<InstanceRO>(() => selectedItem as InstanceRO, [selectedItem]);

  const propertiesState = useGetInstancePropertiesQuery({ instanceId: item.id });

  const loading = useMemo<boolean>(() => propertiesState.isLoading, [propertiesState]);
  const empty = useMemo<boolean>(() => !loading && isEmpty(propertiesState.data), [loading, propertiesState]);

  const tabs = useMemo<TabInfo[] | undefined>(
    () =>
      propertiesState.data
        ? map(propertiesState.data.contexts, (properties, context) => ({ id: context, label: context, lazy: true }))
        : undefined,
    [propertiesState.data]
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
              <InstancePropertiesCode properties={propertiesState.data?.contexts[tab.id] || {}} key={tab.id} />
            ))}
          </TabPanel>
        </Card>
      )}
    </Page>
  );
};

export default InstanceProperties;
