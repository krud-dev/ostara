import React, { FunctionComponent, useMemo } from 'react';
import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';
import { Allotment, LayoutPriority } from 'allotment';
import { SIDEBAR_DEFAULT_WIDTH } from 'renderer/constants/ui';
import useConfigurationStoreState from 'renderer/hooks/useConfigurationStoreState';
import { useNavigatorTree } from 'renderer/contexts/NavigatorTreeContext';
import { EnrichedInstance } from 'infra/configuration/model/configuration';
import InstanceSidebar from 'renderer/layout/instance/components/InstanceSidebar';
import PerfectScrollbar from 'react-perfect-scrollbar';

const InstanceLayout: FunctionComponent = () => {
  const { selectedItem } = useNavigatorTree();

  const item = useMemo<EnrichedInstance | undefined>(
    () => selectedItem as EnrichedInstance | undefined,
    [selectedItem]
  );

  const [sidebarWidth, setSidebarWidth] = useConfigurationStoreState<number>(
    'instanceSidebarWidth',
    SIDEBAR_DEFAULT_WIDTH
  );

  const defaultSizes = useMemo<number[]>(() => [sidebarWidth, window.innerWidth - sidebarWidth], []);

  if (!item) {
    return null;
  }

  return (
    <Box sx={{ width: '100%', height: '100%' }}>
      <Allotment defaultSizes={defaultSizes} proportionalLayout={false} onChange={(sizes) => setSidebarWidth(sizes[0])}>
        <Allotment.Pane minSize={180} maxSize={360} snap>
          <InstanceSidebar item={item} width={sidebarWidth} />
        </Allotment.Pane>
        <Allotment.Pane priority={LayoutPriority.High}>
          <Box sx={{ height: '100%', overflow: 'hidden' }}>
            <PerfectScrollbar options={{ wheelPropagation: false }}>
              <Outlet />
            </PerfectScrollbar>
          </Box>
        </Allotment.Pane>
      </Allotment>
    </Box>
  );
};

export default InstanceLayout;
