import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { experimentalStyled as styled } from '@mui/material/styles';
import { Box, Divider, Drawer, IconButton, Stack } from '@mui/material';
import { SIDEBAR_DRAWER_WIDTH } from 'renderer/constants/ui';
import MHidden from 'renderer/components/layout/MHidden';
import PerfectScrollbar from 'react-perfect-scrollbar';
import NavigatorTree from 'renderer/layout/navigator/components/tree/NavigatorTree';
import SearchTextField from 'renderer/components/input/SearchTextField';
import {
  AddOutlined,
  FilterListOutlined,
  MoreVertOutlined,
} from '@mui/icons-material';

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

export default function NavigatorSidebar({
  isOpenSidebar,
  onCloseSidebar,
}: NavigatorSidebarProps) {
  const { pathname } = useLocation();

  const [search, setSearch] = useState<string>('');

  useEffect(() => {
    if (isOpenSidebar) {
      onCloseSidebar();
    }
  }, [pathname]);

  const renderContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Stack
        direction={'row'}
        spacing={0.5}
        alignItems={'center'}
        sx={{ px: 0.5, py: 1 }}
      >
        <Box>
          <IconButton size={'small'}>
            <AddOutlined fontSize={'small'} />
          </IconButton>
        </Box>
        <SearchTextField
          size={'small'}
          icon={FilterListOutlined}
          onChangeValue={setSearch}
        />
        <Box>
          <IconButton size={'small'}>
            <MoreVertOutlined fontSize={'small'} />
          </IconButton>
        </Box>
      </Stack>

      <Divider />

      <Box sx={{ flexGrow: 1, overflow: 'hidden' }}>
        <PerfectScrollbar options={{ wheelPropagation: false }}>
          <NavigatorTree search={search} />
        </PerfectScrollbar>
      </Box>
    </Box>
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
