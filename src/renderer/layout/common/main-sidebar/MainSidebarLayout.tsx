import MainNavbar from 'renderer/layout/common/main-sidebar/MainNavbar';
import React, { ComponentType, useEffect, useMemo, useRef } from 'react';
import { MAIN_SCROLL_CONTAINER_ID, SIDEBAR_DEFAULT_WIDTH } from 'renderer/constants/ui';
import { Outlet, useLocation } from 'react-router-dom';
import { Box } from '@mui/material';
import AutoSizer from 'react-virtualized-auto-sizer';
import { useLocalStorageState } from '../../../hooks/useLocalStorageState';
import { Allotment, LayoutPriority } from 'allotment';

type MainSidebarLayoutProps = {
  Sidebar: ComponentType<{ width: number }>;
};

export default function MainSidebarLayout({ Sidebar }: MainSidebarLayoutProps) {
  const { pathname } = useLocation();

  const scrollContainerRef = useRef<HTMLElement>();

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }
  }, [pathname]);

  const [sidebarWidth, setSidebarWidth] = useLocalStorageState<number>('sidebarWidth', SIDEBAR_DEFAULT_WIDTH);

  const defaultSizes = useMemo<number[]>(() => [sidebarWidth, window.innerWidth - sidebarWidth], []);

  return (
    <Box sx={{ height: '100%', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <MainNavbar />
      <Box sx={{ flexGrow: 1 }}>
        <Allotment
          defaultSizes={defaultSizes}
          proportionalLayout={false}
          onChange={(sizes) => setSidebarWidth(sizes[0])}
        >
          <Allotment.Pane minSize={200} maxSize={500}>
            <Box sx={{ height: '100%' }}>
              <Sidebar width={sidebarWidth} />
            </Box>
          </Allotment.Pane>
          <Allotment.Pane priority={LayoutPriority.High}>
            <Box sx={{ height: '100%', overflow: 'hidden' }}>
              <AutoSizer disableWidth>
                {({ height }) => (
                  <Box id={MAIN_SCROLL_CONTAINER_ID} ref={scrollContainerRef} sx={{ height: height, overflow: 'auto' }}>
                    <Outlet />
                  </Box>
                )}
              </AutoSizer>
            </Box>
          </Allotment.Pane>
        </Allotment>
      </Box>
    </Box>
  );
}
