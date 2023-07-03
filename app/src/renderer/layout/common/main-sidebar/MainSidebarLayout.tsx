import React, { ComponentType, useEffect, useMemo, useRef } from 'react';
import { MAIN_SCROLL_CONTAINER_ID, SIDEBAR_DEFAULT_WIDTH } from 'renderer/constants/ui';
import { Outlet, useLocation } from 'react-router-dom';
import { Box } from '@mui/material';
import AutoSizer, { VerticalSize } from 'react-virtualized-auto-sizer';
import { useLocalStorageState } from '../../../hooks/useLocalStorageState';
import { Allotment, LayoutPriority } from 'allotment';

type MainSidebarLayoutProps = {
  Sidebar: ComponentType<{ width: number }>;
  snap?: boolean;
};

export default function MainSidebarLayout({ Sidebar, snap }: MainSidebarLayoutProps) {
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
    <Allotment defaultSizes={defaultSizes} proportionalLayout={false} onChange={(sizes) => setSidebarWidth(sizes[0])}>
      <Allotment.Pane minSize={200} maxSize={500} snap={snap}>
        <Box sx={{ height: '100%' }}>
          <Sidebar width={sidebarWidth} />
        </Box>
      </Allotment.Pane>
      <Allotment.Pane priority={LayoutPriority.High}>
        <Box sx={{ height: '100%', overflow: 'hidden' }}>
          <AutoSizer disableWidth>
            {({ height }: VerticalSize) => (
              <Box id={MAIN_SCROLL_CONTAINER_ID} ref={scrollContainerRef} sx={{ height: height, overflow: 'auto' }}>
                <Outlet />
              </Box>
            )}
          </AutoSizer>
        </Box>
      </Allotment.Pane>
    </Allotment>
  );
}
