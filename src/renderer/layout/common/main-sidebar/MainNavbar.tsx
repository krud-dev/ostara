import { AppBar, Box, Divider, IconButton, Stack, Toolbar } from '@mui/material';
import LanguageMenu from 'renderer/layout/common/main-sidebar/navbar/LanguageMenu';
import { COMPONENTS_SPACING, NAVBAR_HEIGHT } from 'renderer/constants/ui';
import { Home, HomeOutlined } from '@mui/icons-material';
import AccountMenu from 'renderer/layout/common/main-sidebar/navbar/AccountMenu';
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { urls } from 'renderer/routes/urls';
import { IconViewer } from 'renderer/components/common/IconViewer';
import { useUi } from 'renderer/contexts/UiContext';

type MainNavbarProps = {};

export default function MainNavbar({}: MainNavbarProps) {
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
        '-webkit-user-select': 'none',
        '-webkit-app-region': 'drag',
      }}
    >
      <Toolbar disableGutters sx={{ flexGrow: 1, px: COMPONENTS_SPACING }}>
        <Stack direction="row" spacing={0.5} sx={{ pl: 8 }}>
          <Box>
            <IconButton size={'small'} onClick={homeHandler} sx={{ color: 'text.primary' }}>
              <Home fontSize={'medium'} />
            </IconButton>
          </Box>
          <Box>
            <IconButton size={'small'} onClick={backHandler} sx={{ color: 'text.primary' }}>
              <IconViewer
                icon={isRtl ? 'KeyboardArrowRightOutlined' : 'KeyboardArrowLeftOutlined'}
                fontSize={'medium'}
                sx={{ color: 'text.primary' }}
              />
            </IconButton>
          </Box>
          <Box>
            <IconButton size={'small'} onClick={forwardHandler} sx={{ color: 'text.primary' }}>
              <IconViewer
                icon={isRtl ? 'KeyboardArrowLeftOutlined' : 'KeyboardArrowRightOutlined'}
                fontSize={'medium'}
                sx={{ color: 'text.primary' }}
              />
            </IconButton>
          </Box>
        </Stack>

        <Box sx={{ flexGrow: 1 }} />

        <Stack direction="row" spacing={{ xs: 0.5, sm: 1 }}>
          <LanguageMenu />
          <AccountMenu />
        </Stack>
      </Toolbar>
      <Divider />
    </AppBar>
  );
}
