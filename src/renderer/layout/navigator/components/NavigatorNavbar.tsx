import { AppBar, Box, Divider, IconButton, Stack, Toolbar } from '@mui/material';
import LanguageMenu from 'renderer/layout/navigator/components/navbar/LanguageMenu';
import { NAVBAR_HEIGHT } from 'renderer/constants/ui';
import { HomeOutlined } from '@mui/icons-material';
import AccountMenu from 'renderer/layout/navigator/components/navbar/AccountMenu';
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

type NavigatorNavbarProps = {
  sidebarWidth: number;
};

export default function NavigatorNavbar({ sidebarWidth }: NavigatorNavbarProps) {
  const navigate = useNavigate();

  const homeHandler = useCallback(() => {
    navigate('/');
  }, [navigate]);

  return (
    <AppBar
      sx={{
        minHeight: NAVBAR_HEIGHT,
        display: 'flex',
        backgroundColor: (theme) => theme.palette.background.default,
        width: `calc(100% - ${sidebarWidth + 1}px)`,
      }}
    >
      <Toolbar sx={{ flexGrow: 1 }}>
        <IconButton size={'medium'} onClick={homeHandler} sx={{ mr: 1, color: 'text.primary' }}>
          <HomeOutlined fontSize={'large'} />
        </IconButton>

        <Box sx={{ flexGrow: 1 }} />

        <Stack direction="row" spacing={{ xs: 0.5, sm: 1.5 }}>
          <LanguageMenu />
          <AccountMenu />
        </Stack>
      </Toolbar>
      <Divider />
    </AppBar>
  );
}
