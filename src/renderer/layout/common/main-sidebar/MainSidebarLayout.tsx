import { experimentalStyled as styled, useTheme } from '@mui/material/styles';
import MainNavbar from 'renderer/layout/common/main-sidebar/MainNavbar';
import { Allotment, LayoutPriority } from 'allotment';
import { ComponentType, useEffect, useMemo, useRef } from 'react';
import { MAIN_SCROLL_CONTAINER_ID, SIDEBAR_DEFAULT_WIDTH } from 'renderer/constants/ui';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { Outlet, useLocation } from 'react-router-dom';
import { Box } from '@mui/material';
import { useLocalStorageState } from '../../../hooks/useLocalStorageState';

const RootStyle = styled('div')({
  height: '100%',
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
});

const MainStyle = styled('div')(({ theme }) => ({
  height: '100%',
  overflow: 'hidden',
}));

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

  const [sidebarWidth, setSidebarWidth] = useLocalStorageState<number>('sidebarWidth', SIDEBAR_DEFAULT_WIDTH);

  const defaultSizes = useMemo<number[]>(() => [sidebarWidth, window.innerWidth - sidebarWidth], []);

  return (
    <RootStyle>
      <MainNavbar />
      <Box sx={{ flexGrow: 1 }}>
        <Allotment
          defaultSizes={defaultSizes}
          proportionalLayout={false}
          onChange={(sizes) => setSidebarWidth(sizes[0])}
        >
          <Allotment.Pane minSize={200} maxSize={500} snap>
            <Box sx={{ height: '100%' }}>
              <Sidebar width={sidebarWidth} />
            </Box>
          </Allotment.Pane>
          <Allotment.Pane priority={LayoutPriority.High}>
            <MainStyle
              sx={{
                transition: theme.transitions.create('margin', {
                  duration: theme.transitions.duration.complex,
                }),
              }}
            >
              <PerfectScrollbar
                id={MAIN_SCROLL_CONTAINER_ID}
                containerRef={(el) => {
                  scrollContainerRef.current = el;
                }}
              >
                <Outlet />
              </PerfectScrollbar>
            </MainStyle>
          </Allotment.Pane>
        </Allotment>
      </Box>
    </RootStyle>
  );
}
