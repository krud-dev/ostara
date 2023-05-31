import { AppBar, Box, Divider, Stack, Toolbar } from '@mui/material';
import { COMPONENTS_SPACING, NAVBAR_HEIGHT } from 'renderer/constants/ui';
import { BarChartOutlined, Home } from '@mui/icons-material';
import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { urls } from 'renderer/routes/urls';
import { useSettings } from 'renderer/contexts/SettingsContext';
import { isMac } from 'renderer/utils/platformUtils';
import WindowControls from './navbar/WindowControls';
import { useMaximizeWindow } from '../../../apis/requests/ui/maximizeWindow';
import SettingsMenu from './navbar/SettingsMenu';
import HelpMenu from './navbar/HelpMenu';
import AppFeedbackMenu from './navbar/AppFeedbackMenu';
import NavbarIconButton from './navbar/NavbarIconButton';

type MainNavbarProps = {};

export default function MainNavbar({}: MainNavbarProps) {
  const { isRtl, daemonHealthy } = useSettings();
  const navigate = useNavigate();

  const homeHandler = useCallback(() => {
    navigate(urls.home.url);
  }, [navigate]);

  const dashboardHandler = useCallback(() => {
    navigate(urls.dashboard.url);
  }, [navigate]);

  const backHandler = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  const forwardHandler = useCallback(() => {
    navigate(1);
  }, [navigate]);

  const maximizeWindowState = useMaximizeWindow();

  const toggleMaximizeHandler = useCallback(async (): Promise<void> => {
    await maximizeWindowState.mutateAsync({});
  }, []);

  return (
    <AppBar
      position={'static'}
      onDoubleClick={toggleMaximizeHandler}
      sx={{
        minHeight: NAVBAR_HEIGHT,
        display: 'flex',
        backgroundColor: (theme) => theme.palette.background.default,
        '-webkit-user-select': 'none',
        '-webkit-app-region': 'drag',
      }}
    >
      <Toolbar disableGutters sx={{ flexGrow: 1, pl: COMPONENTS_SPACING, pr: !isMac ? '0' : COMPONENTS_SPACING }}>
        {daemonHealthy && (
          <Stack direction="row" spacing={0.5} sx={{ pl: isMac ? 8 : 0 }}>
            <NavbarIconButton titleId={'home'} icon={'Home'} onClick={homeHandler} />
            <NavbarIconButton titleId={'globalDashboard'} icon={'BarChartOutlined'} onClick={dashboardHandler} />
            <NavbarIconButton
              titleId={'back'}
              icon={isRtl ? 'KeyboardArrowRightOutlined' : 'KeyboardArrowLeftOutlined'}
              onClick={backHandler}
            />
            <NavbarIconButton
              titleId={'forward'}
              icon={isRtl ? 'KeyboardArrowLeftOutlined' : 'KeyboardArrowRightOutlined'}
              onClick={forwardHandler}
            />
          </Stack>
        )}

        <Box sx={{ flexGrow: 1 }} />

        <Stack direction="row" spacing={0.5}>
          <HelpMenu />
          <AppFeedbackMenu />
          <SettingsMenu />
        </Stack>

        {!isMac && <WindowControls sx={{ pl: 2, '-webkit-app-region': 'no-drag' }} />}
      </Toolbar>
      <Divider />
    </AppBar>
  );
}
