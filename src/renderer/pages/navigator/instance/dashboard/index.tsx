import React, { FunctionComponent, useMemo } from 'react';
import Page from 'renderer/components/layout/Page';
import { useNavigatorTree } from 'renderer/contexts/NavigatorTreeContext';
import DashboardWidget from 'renderer/components/widget/DashboardWidget';
import { Stack } from '@mui/material';
import { COMPONENTS_SPACING } from 'renderer/constants/ui';
import { InstanceRO } from '../../../../../common/generated_definitions';
import useDashboardWidgets from './hooks/useDashboardWidgets';

const InstanceDashboard: FunctionComponent = () => {
  const { selectedItem } = useNavigatorTree();

  const item = useMemo<InstanceRO>(() => selectedItem as InstanceRO, [selectedItem]);

  const widgets = useDashboardWidgets();
  const intervalSeconds = useMemo<number>(() => 5, []);

  return (
    <Page>
      <Stack direction={'column'} spacing={COMPONENTS_SPACING}>
        {widgets.map((widget) => (
          <DashboardWidget widget={widget} item={item} intervalSeconds={intervalSeconds} key={widget.id} />
        ))}
      </Stack>
    </Page>
  );
};

export default InstanceDashboard;
