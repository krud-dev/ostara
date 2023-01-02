import { AppBar, Box, Divider, IconButton, Stack, Toolbar } from '@mui/material';
import LanguageMenu from 'renderer/layout/common/navbar/LanguageMenu';
import { COMPONENTS_SPACING, NAVBAR_HEIGHT } from 'renderer/constants/ui';
import { HomeOutlined } from '@mui/icons-material';
import AccountMenu from 'renderer/layout/common/navbar/AccountMenu';
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { urls } from 'renderer/routes/urls';

type MainNavbarProps = {
  sidebarWidth: number;
};

export default function MainNavbar({ sidebarWidth }: MainNavbarProps) {
  const navigate = useNavigate();

  const homeHandler = useCallback(() => {
    navigate(urls.home.url);
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
      <Toolbar disableGutters sx={{ flexGrow: 1, px: COMPONENTS_SPACING }}>
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
