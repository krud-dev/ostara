import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { experimentalStyled as styled, useTheme } from '@mui/material/styles';
import NavigatorNavbar from 'renderer/layout/navigator/components/NavigatorNavbar';
import NavigatorSidebar from 'renderer/layout/navigator/components/NavigatorSidebar';
import {
  NAVBAR_DESKTOP_HEIGHT,
  NAVBAR_MOBILE_HEIGHT,
} from '../../constants/ui';

const RootStyle = styled('div')({
  display: 'flex',
  minHeight: '100%',
  overflow: 'hidden',
});

const MainStyle = styled('div')(({ theme }) => ({
  flexGrow: 1,
  overflow: 'auto',
  minHeight: '100%',
  paddingTop: NAVBAR_MOBILE_HEIGHT + 24,
  paddingBottom: theme.spacing(5),
  [theme.breakpoints.up('lg')]: {
    paddingTop: NAVBAR_DESKTOP_HEIGHT + 24,
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
}));

type NavigatorLayoutProps = {};

export default function NavigatorLayout({}: NavigatorLayoutProps) {
  const theme = useTheme();

  const [open, setOpen] = useState<boolean>(false);

  return (
    <RootStyle>
      <NavigatorNavbar onOpenSidebar={() => setOpen(true)} />
      <NavigatorSidebar
        isOpenSidebar={open}
        onCloseSidebar={() => setOpen(false)}
      />
      <MainStyle
        sx={{
          transition: theme.transitions.create('margin', {
            duration: theme.transitions.duration.complex,
          }),
        }}
      >
        <Outlet />
      </MainStyle>
    </RootStyle>
  );
}
