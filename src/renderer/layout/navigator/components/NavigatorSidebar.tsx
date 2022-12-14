import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { experimentalStyled as styled } from '@mui/material/styles';
import { Drawer, Stack } from '@mui/material';
import { SIDEBAR_DRAWER_WIDTH } from 'renderer/constants/ui';
import MHidden from 'renderer/components/layout/MHidden';
import PerfectScrollbar from 'react-perfect-scrollbar';

const RootStyle = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('lg')]: {
    flexShrink: 0,
    width: SIDEBAR_DRAWER_WIDTH,
  },
}));

type AppSidebarProps = {
  isOpenSidebar: boolean;
  onCloseSidebar: VoidFunction;
};

export default function NavigatorSidebar({
  isOpenSidebar,
  onCloseSidebar,
}: AppSidebarProps) {
  const { pathname } = useLocation();

  useEffect(() => {
    if (isOpenSidebar) {
      onCloseSidebar();
    }
  }, [pathname]);

  const renderContent = (
    <PerfectScrollbar
      options={{ suppressScrollX: true, wheelPropagation: false }}
    >
      <Stack
        spacing={3}
        sx={{
          px: 2.5,
          pt: 3,
          pb: 2,
        }}
      />
    </PerfectScrollbar>
  );

  return (
    <RootStyle
      sx={{
        width: {
          lg: SIDEBAR_DRAWER_WIDTH,
        },
      }}
    >
      <MHidden width="lgUp">
        <Drawer
          open={isOpenSidebar}
          onClose={onCloseSidebar}
          PaperProps={{
            sx: { width: SIDEBAR_DRAWER_WIDTH },
          }}
        >
          {renderContent}
        </Drawer>
      </MHidden>

      <MHidden width="lgDown">
        <Drawer
          open
          variant="persistent"
          PaperProps={{
            sx: {
              width: SIDEBAR_DRAWER_WIDTH,
              bgcolor: 'background.default',
            },
          }}
        >
          {renderContent}
        </Drawer>
      </MHidden>
    </RootStyle>
  );
}
