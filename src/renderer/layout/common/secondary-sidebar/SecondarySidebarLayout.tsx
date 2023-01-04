import React, { ComponentType, useMemo } from 'react';
import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';
import { Allotment, LayoutPriority } from 'allotment';
import { INTERNAL_SIDEBAR_MAX_WIDTH, INTERNAL_SIDEBAR_MIN_WIDTH, SIDEBAR_DEFAULT_WIDTH } from 'renderer/constants/ui';
import useConfigurationStoreState from 'renderer/hooks/useConfigurationStoreState';
import PerfectScrollbar from 'react-perfect-scrollbar';

type SecondarySidebarLayoutProps<T> = {
  Sidebar: ComponentType<{ width: number } & T>;
  sidebarProps: T;
};

export default function SecondarySidebarLayout<T>({ Sidebar, sidebarProps }: SecondarySidebarLayoutProps<T>) {
  const [sidebarWidth, setSidebarWidth] = useConfigurationStoreState<number>(
    'secondarySidebarWidth',
    SIDEBAR_DEFAULT_WIDTH
  );

  const defaultSizes = useMemo<number[]>(() => [sidebarWidth, window.innerWidth - sidebarWidth], []);

  return (
    <Box sx={{ width: '100%', height: '100%' }}>
      <Allotment defaultSizes={defaultSizes} proportionalLayout={false} onChange={(sizes) => setSidebarWidth(sizes[0])}>
        <Allotment.Pane minSize={INTERNAL_SIDEBAR_MIN_WIDTH} maxSize={INTERNAL_SIDEBAR_MAX_WIDTH} snap>
          <Sidebar width={sidebarWidth} {...sidebarProps} />
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
}
