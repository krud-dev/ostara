import React, { ComponentType, ReactNode, useEffect, useRef } from 'react';
import { Box, Divider } from '@mui/material';
import { Outlet, useLocation } from 'react-router-dom';
import { SECONDARY_SCROLL_CONTAINER_ID, SIDEBAR_DEFAULT_WIDTH } from 'renderer/constants/ui';
import AutoSizer from 'react-virtualized-auto-sizer';

type SecondarySidebarLayoutProps<T> = {
  Sidebar: ComponentType<{ width: number } & T>;
  sidebarProps: T;
  content?: ReactNode;
};

export default function SecondarySidebarLayout<T>({ Sidebar, sidebarProps, content }: SecondarySidebarLayoutProps<T>) {
  const { pathname } = useLocation();

  const scrollContainerRef = useRef<HTMLElement>();

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }
  }, [pathname]);

  return (
    <Box sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'row', overflow: 'hidden' }}>
      <Box sx={{ width: SIDEBAR_DEFAULT_WIDTH, minWidth: SIDEBAR_DEFAULT_WIDTH, height: '100%', overflow: 'hidden' }}>
        <Sidebar width={SIDEBAR_DEFAULT_WIDTH} {...sidebarProps} />
      </Box>

      <Divider orientation={'vertical'} flexItem />

      <Box sx={{ height: '100%', overflow: 'hidden', flexGrow: 1 }}>
        <AutoSizer disableWidth>
          {({ height }) => (
            <Box
              id={SECONDARY_SCROLL_CONTAINER_ID}
              ref={scrollContainerRef}
              sx={{ height: height, overflowY: 'auto', overflowX: 'hidden' }}
            >
              {content || <Outlet />}
            </Box>
          )}
        </AutoSizer>
      </Box>
    </Box>
  );
}
