import React, { FunctionComponent, useMemo } from 'react';
import Page from 'renderer/components/layout/Page';
import { useNavigatorLayout } from 'renderer/contexts/NavigatorLayoutContext';
import { Card } from '@mui/material';
import { useGetInstancePropertiesQuery } from 'renderer/apis/requests/instance/properties/getInstanceProperties';
import { isEmpty, map } from 'lodash';
import EmptyContent from 'renderer/components/help/EmptyContent';
import InstancePropertiesCode from 'renderer/pages/navigator/instance/properties/components/InstancePropertiesCode';
import TabPanel, { TabInfo } from 'renderer/components/layout/TabPanel';
import { InstanceRO } from '../../../../../common/generated_definitions';
import RedactionAlert from '../../../../components/help/RedactionAlert';
import { COMPONENTS_SPACING } from '../../../../constants/ui';
import useRerenderKey from '../../../../hooks/useRerenderKey';
import LogoLoaderCenter from '../../../../components/common/LogoLoaderCenter';

const InstanceProperties: FunctionComponent = () => {
  const { selectedItem } = useNavigatorLayout();

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

  const showRedactionAlert = useMemo<boolean>(
    () =>
      !empty && (propertiesState.data?.redactionLevel === 'PARTIAL' || propertiesState.data?.redactionLevel === 'FULL'),
    [empty, propertiesState.data]
  );

  const [rerenderKey, rerender] = useRerenderKey();

  return (
    <Page sx={{ height: '100%' }}>
      {loading && <LogoLoaderCenter />}

      {empty && <EmptyContent />}
      {showRedactionAlert && (
        <RedactionAlert localStorageKeySuffix={'properties'} onDismiss={rerender} sx={{ mb: COMPONENTS_SPACING }} />
      )}

      {tabs && (
        <Card key={rerenderKey}>
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
