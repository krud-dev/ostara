import React, { FunctionComponent, useMemo } from 'react';
import Page from 'renderer/components/layout/Page';
import { useNavigatorTree } from 'renderer/contexts/NavigatorTreeContext';
import { Box, Card, CircularProgress } from '@mui/material';
import { useGetInstancePropertiesQuery } from 'renderer/apis/instance/getInstanceProperties';
import { isEmpty, map } from 'lodash';
import EmptyContent from 'renderer/components/help/EmptyContent';
import { FormattedMessage } from 'react-intl';
import InstancePropertiesCode from 'renderer/pages/navigator/instance/properties/widgets/InstancePropertiesCode';
import TabPanel, { TabInfo } from 'renderer/components/layout/TabPanel';
import { InstanceRO } from '../../../../../common/generated_definitions';

const InstanceProperties: FunctionComponent = () => {
  const { selectedItem } = useNavigatorTree();

  const item = useMemo<InstanceRO>(() => selectedItem as InstanceRO, [selectedItem]);

  const propertiesState = useGetInstancePropertiesQuery({ instanceId: item.id });

  const loading = useMemo<boolean>(() => propertiesState.isLoading, [propertiesState]);
  const empty = useMemo<boolean>(() => !loading && isEmpty(propertiesState.data), [loading, propertiesState]);

  const tabs = useMemo<TabInfo[] | undefined>(
    () =>
      propertiesState.data
        ? map(propertiesState.data, (properties, context) => ({ id: context, label: context, lazy: true }))
        : undefined,
    [propertiesState.data]
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
              <InstancePropertiesCode properties={propertiesState.data?.[tab.id] || {}} key={tab.id} />
            ))}
          </TabPanel>
        </Card>
      )}
    </Page>
  );
};

export default InstanceProperties;
