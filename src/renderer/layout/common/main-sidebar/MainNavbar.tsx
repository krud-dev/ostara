import { AppBar, Box, Divider, IconButton, Stack, Toolbar } from '@mui/material';
import LanguageMenu from 'renderer/layout/common/main-sidebar/navbar/LanguageMenu';
import { COMPONENTS_SPACING, NAVBAR_HEIGHT } from 'renderer/constants/ui';
import { HomeOutlined } from '@mui/icons-material';
import AccountMenu from 'renderer/layout/common/main-sidebar/navbar/AccountMenu';
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { urls } from 'renderer/routes/urls';
import { IconViewer } from 'renderer/components/common/IconViewer';
import { useUi } from 'renderer/contexts/UiContext';

type MainNavbarProps = {
  sidebarWidth: number;
};

export default function MainNavbar({ sidebarWidth }: MainNavbarProps) {
  const { isRtl } = useUi();
  const navigate = useNavigate();

  const homeHandler = useCallback(() => {
    navigate(urls.home.url);
  }, [navigate]);

  const backHandler = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  const forwardHandler = useCallback(() => {
    navigate(1);
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
        <Stack direction="row" spacing={0.5}>
          <IconButton size={'medium'} onClick={homeHandler} sx={{ color: 'text.primary' }}>
            <HomeOutlined fontSize={'large'} />
          </IconButton>
          <IconButton size={'medium'} onClick={backHandler} sx={{ color: 'text.primary' }}>
            <IconViewer
              icon={isRtl ? 'KeyboardArrowRightOutlined' : 'KeyboardArrowLeftOutlined'}
              fontSize={'large'}
              sx={{ color: 'text.primary' }}
            />
          </IconButton>
          <IconButton size={'medium'} onClick={forwardHandler} sx={{ color: 'text.primary' }}>
            <IconViewer
              icon={isRtl ? 'KeyboardArrowLeftOutlined' : 'KeyboardArrowRightOutlined'}
              fontSize={'large'}
              sx={{ color: 'text.primary' }}
            />
          </IconButton>
        </Stack>

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
