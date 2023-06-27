import React, { FunctionComponent, useMemo } from 'react';
import Page from 'renderer/components/layout/Page';
import { useNavigatorLayoutContext } from 'renderer/contexts/NavigatorLayoutContext';
import DashboardWidget from 'renderer/components/widget/DashboardWidget';
import { ANIMATION_GROW_TOP_STYLE, ANIMATION_TIMEOUT_LONG, COMPONENTS_SPACING } from 'renderer/constants/ui';
import { InstanceRO } from '../../../../../common/generated_definitions';
import useDashboardWidgets from './hooks/useDashboardWidgets';
import Grid2 from '@mui/material/Unstable_Grid2';
import { Grow } from '@mui/material';
import { TransitionGroup } from 'react-transition-group';

const InstanceDashboard: FunctionComponent = () => {
  const { selectedItem } = useNavigatorLayoutContext();

  const item = useMemo<InstanceRO>(() => selectedItem as InstanceRO, [selectedItem]);

  const widgets = useDashboardWidgets();
  const intervalSeconds = useMemo<number>(() => 5, []);

  return (
    <Page>
      <Grid2 container spacing={COMPONENTS_SPACING}>
        <TransitionGroup component={null}>
          <Grow timeout={ANIMATION_TIMEOUT_LONG} style={ANIMATION_GROW_TOP_STYLE}>
            <Grid2 xs={12} lg={6}>
              <DashboardWidget widget={widgets.healthStatusWidget} item={item} intervalSeconds={intervalSeconds} />
            </Grid2>
          </Grow>
          <Grow timeout={ANIMATION_TIMEOUT_LONG} style={ANIMATION_GROW_TOP_STYLE}>
            <Grid2 xs={12} lg={6}>
              <DashboardWidget widget={widgets.uptimeWidget} item={item} intervalSeconds={intervalSeconds} />
            </Grid2>
          </Grow>
          <Grow timeout={ANIMATION_TIMEOUT_LONG * 2} style={ANIMATION_GROW_TOP_STYLE}>
            <Grid2 xs={12} lg={6} xl={4}>
              <DashboardWidget widget={widgets.memoryUsageCircle} item={item} intervalSeconds={intervalSeconds} />
            </Grid2>
          </Grow>
          <Grow timeout={ANIMATION_TIMEOUT_LONG * 2} style={ANIMATION_GROW_TOP_STYLE}>
            <Grid2 xs={12} lg={6} xl={4}>
              <DashboardWidget widget={widgets.diskUsageCircle} item={item} intervalSeconds={intervalSeconds} />
            </Grid2>
          </Grow>
          <Grow timeout={ANIMATION_TIMEOUT_LONG * 2} style={ANIMATION_GROW_TOP_STYLE}>
            <Grid2 xs={12} xl={4}>
              <DashboardWidget widget={widgets.cpuUsageCircle} item={item} intervalSeconds={intervalSeconds} />
            </Grid2>
          </Grow>
          <Grow timeout={ANIMATION_TIMEOUT_LONG * 3} style={ANIMATION_GROW_TOP_STYLE}>
            <Grid2 xs={12} xl={6}>
              <DashboardWidget widget={widgets.threadCount} item={item} intervalSeconds={intervalSeconds} />
            </Grid2>
          </Grow>
          <Grow timeout={ANIMATION_TIMEOUT_LONG * 3} style={ANIMATION_GROW_TOP_STYLE}>
            <Grid2 xs={12} xl={6}>
              <DashboardWidget widget={widgets.memoryUsageTimeline} item={item} intervalSeconds={intervalSeconds} />
            </Grid2>
          </Grow>
        </TransitionGroup>
      </Grid2>
    </Page>
  );
};

export default InstanceDashboard;
