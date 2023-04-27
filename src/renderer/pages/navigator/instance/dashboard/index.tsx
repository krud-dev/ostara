import React, { FunctionComponent, useMemo } from 'react';
import Page from 'renderer/components/layout/Page';
import { useNavigatorTree } from 'renderer/contexts/NavigatorTreeContext';
import DashboardWidget from 'renderer/components/widget/DashboardWidget';
import { COMPONENTS_SPACING } from 'renderer/constants/ui';
import { InstanceRO } from '../../../../../common/generated_definitions';
import useDashboardWidgets from './hooks/useDashboardWidgets';
import Grid2 from '@mui/material/Unstable_Grid2';

const InstanceDashboard: FunctionComponent = () => {
  const { selectedItem } = useNavigatorTree();

  const item = useMemo<InstanceRO>(() => selectedItem as InstanceRO, [selectedItem]);

  const widgets = useDashboardWidgets();

  return (
    <Page>
      <Grid2 container spacing={COMPONENTS_SPACING}>
        <Grid2 xs={12} lg={6}>
          <DashboardWidget widget={widgets.healthStatusWidget} item={item} />
        </Grid2>
        <Grid2 xs={12} lg={6}>
          <DashboardWidget widget={widgets.uptimeWidget} item={item} />
        </Grid2>
        <Grid2 xs={12} lg={6} xl={4}>
          <DashboardWidget widget={widgets.memoryUsageCircle} item={item} />
        </Grid2>
        <Grid2 xs={12} lg={6} xl={4}>
          <DashboardWidget widget={widgets.diskUsageCircle} item={item} />
        </Grid2>
        <Grid2 xs={12} xl={4}>
          <DashboardWidget widget={widgets.cpuUsageCircle} item={item} />
        </Grid2>
        <Grid2 xs={12} xl={6}>
          <DashboardWidget widget={widgets.threadCount} item={item} />
        </Grid2>
        <Grid2 xs={12} xl={6}>
          <DashboardWidget widget={widgets.memoryUsageTimeline} item={item} />
        </Grid2>
      </Grid2>
    </Page>
  );
};

export default InstanceDashboard;
