import { useState } from 'react';
import { experimentalStyled as styled } from '@mui/material/styles';
import { Box, Divider, Drawer, Stack } from '@mui/material';
import { NAVBAR_HEIGHT } from 'renderer/constants/ui';
import PerfectScrollbar from 'react-perfect-scrollbar';
import NavigatorTree from 'renderer/layout/navigator/components/sidebar/tree/NavigatorTree';
import SearchTextField from 'renderer/components/input/SearchTextField';
import { FilterListOutlined } from '@mui/icons-material';
import CreateItemMenu from 'renderer/layout/navigator/components/sidebar/menus/CreateItemMenu';
import SearchItemMenu from 'renderer/layout/navigator/components/sidebar/menus/SearchItemMenu';
import { NavigatorTreeProvider } from 'renderer/contexts/NavigatorTreeContext';

const RootStyle = styled('div')(({ theme }) => ({
  flexShrink: 0,
}));

type NavigatorSidebarProps = {
  width: number;
};

export default function NavigatorSidebar({ width }: NavigatorSidebarProps) {
  const [search, setSearch] = useState<string>('');

  return (
    <NavigatorTreeProvider>
      <RootStyle>
        <Drawer
          open
          variant="persistent"
          PaperProps={{
            sx: {
              width: width,
              bgcolor: 'background.default',
            },
          }}
        >
          <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ height: NAVBAR_HEIGHT, display: 'flex', flexDirection: 'column' }}>
              <Stack direction={'row'} spacing={0.5} alignItems={'center'} sx={{ flexGrow: 1, px: 0.5 }}>
                <Box>
                  <CreateItemMenu />
                </Box>
                <SearchTextField size={'small'} icon={FilterListOutlined} onChangeValue={setSearch} />
                <Box>
                  <SearchItemMenu />
                </Box>
              </Stack>

              <Divider />
            </Box>

            <Box sx={{ flexGrow: 1, overflow: 'hidden' }}>
              <PerfectScrollbar options={{ wheelPropagation: false }}>
                <NavigatorTree width={width} search={search} />
              </PerfectScrollbar>
            </Box>
          </Box>
        </Drawer>
      </RootStyle>
    </NavigatorTreeProvider>
  );
}
