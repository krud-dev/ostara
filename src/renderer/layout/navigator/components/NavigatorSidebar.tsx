import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { experimentalStyled as styled } from '@mui/material/styles';
import { Box, Divider, Drawer, Stack } from '@mui/material';
import { SIDEBAR_DRAWER_WIDTH } from 'renderer/constants/ui';
import MHidden from 'renderer/components/layout/MHidden';
import PerfectScrollbar from 'react-perfect-scrollbar';
import NavigatorTree from 'renderer/layout/navigator/components/sidebar/tree/NavigatorTree';
import SearchTextField from 'renderer/components/input/SearchTextField';
import { FilterListOutlined } from '@mui/icons-material';
import CreateItemMenu from 'renderer/layout/navigator/components/sidebar/menus/CreateItemMenu';
import SearchItemMenu from 'renderer/layout/navigator/components/sidebar/menus/SearchItemMenu';
import { NavigatorTreeProvider } from 'renderer/contexts/NavigatorTreeContext';

const RootStyle = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('lg')]: {
    flexShrink: 0,
    width: SIDEBAR_DRAWER_WIDTH,
  },
}));

type NavigatorSidebarProps = {
  isOpenSidebar: boolean;
  onCloseSidebar: VoidFunction;
};

export default function NavigatorSidebar({ isOpenSidebar, onCloseSidebar }: NavigatorSidebarProps) {
  const { pathname } = useLocation();

  const [search, setSearch] = useState<string>('');

  useEffect(() => {
    if (isOpenSidebar) {
      onCloseSidebar();
    }
  }, [pathname]);

  const renderContent = (
    <NavigatorTreeProvider>
      <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Stack direction={'row'} spacing={0.5} alignItems={'center'} sx={{ px: 0.5, py: 1 }}>
          <Box>
            <CreateItemMenu />
          </Box>
          <SearchTextField size={'small'} icon={FilterListOutlined} onChangeValue={setSearch} />
          <Box>
            <SearchItemMenu />
          </Box>
        </Stack>

        <Divider />

        <Box sx={{ flexGrow: 1, overflow: 'hidden' }}>
          <PerfectScrollbar options={{ wheelPropagation: false }}>
            <NavigatorTree search={search} />
          </PerfectScrollbar>
        </Box>
      </Box>
    </NavigatorTreeProvider>
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
