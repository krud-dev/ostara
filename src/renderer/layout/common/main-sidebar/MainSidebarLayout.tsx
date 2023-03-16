import { useTheme } from '@mui/material/styles';
import MainNavbar from 'renderer/layout/common/main-sidebar/MainNavbar';
import React, { ComponentType, useEffect, useRef } from 'react';
import { MAIN_SCROLL_CONTAINER_ID, SIDEBAR_DEFAULT_WIDTH } from 'renderer/constants/ui';
import { Outlet, useLocation } from 'react-router-dom';
import { Box, Divider } from '@mui/material';
import NavigatorTree from '../../navigator/components/sidebar/tree/NavigatorTree';
import AutoSizer from 'react-virtualized-auto-sizer';

type MainSidebarLayoutProps = {
  Sidebar: ComponentType<{ width: number }>;
};

export default function MainSidebarLayout({ Sidebar }: MainSidebarLayoutProps) {
  const theme = useTheme();
  const { pathname } = useLocation();

  const scrollContainerRef = useRef<HTMLElement>();

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }
  }, [pathname]);

  return (
    <Box sx={{ height: '100%', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <MainNavbar />
      <Box sx={{ display: 'flex', flexDirection: 'row', flexGrow: 1 }}>
        <Box sx={{ width: SIDEBAR_DEFAULT_WIDTH, height: '100%' }}>
          <Sidebar width={SIDEBAR_DEFAULT_WIDTH} />
        </Box>

        <Divider orientation={'vertical'} flexItem />

        <Box sx={{ height: '100%', overflow: 'hidden', flexGrow: 1 }}>
          <AutoSizer disableWidth>
            {({ height }) => (
              <Box id={MAIN_SCROLL_CONTAINER_ID} ref={scrollContainerRef} sx={{ height: height, overflow: 'auto' }}>
                <Outlet />
              </Box>
            )}
          </AutoSizer>
        </Box>
      </Box>
    </Box>
  );
}
