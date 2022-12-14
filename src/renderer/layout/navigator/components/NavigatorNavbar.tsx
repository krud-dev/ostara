import { alpha, experimentalStyled as styled } from '@mui/material/styles';
import { AppBar, Box, IconButton, Stack, Toolbar } from '@mui/material';
import LanguagePopover from 'renderer/layout/navigator/components/LanguagePopover';
import {
  NAVBAR_DESKTOP_HEIGHT,
  NAVBAR_MOBILE_HEIGHT,
  SIDEBAR_DRAWER_WIDTH,
} from 'renderer/constants/ui';
import MHidden from 'renderer/components/layout/MHidden';
import { MenuOutlined } from '@mui/icons-material';

const RootStyle = styled(AppBar)(({ theme }) => ({
  boxShadow: 'none',
  backdropFilter: 'blur(6px)',
  WebkitBackdropFilter: 'blur(6px)', // Fix on Mobile
  backgroundColor: alpha(theme.palette.background.default, 0.72),
  [theme.breakpoints.up('lg')]: {
    width: `calc(100% - ${SIDEBAR_DRAWER_WIDTH + 1}px)`,
  },
}));

const ToolbarStyle = styled(Toolbar)(({ theme }) => ({
  minHeight: NAVBAR_MOBILE_HEIGHT,
  [theme.breakpoints.up('lg')]: {
    minHeight: NAVBAR_DESKTOP_HEIGHT,
    padding: theme.spacing(0, 5),
  },
}));

// ----------------------------------------------------------------------

type NavigatorNavbarProps = {
  onOpenSidebar: VoidFunction;
};

export default function NavigatorNavbar({
  onOpenSidebar,
}: NavigatorNavbarProps) {
  return (
    <RootStyle>
      <ToolbarStyle>
        <MHidden width="lgUp">
          <IconButton
            onClick={onOpenSidebar}
            size={'large'}
            sx={{ mr: 1, color: 'text.primary' }}
          >
            <MenuOutlined />
          </IconButton>
        </MHidden>

        <Box sx={{ flexGrow: 1 }} />

        <Stack direction="row" spacing={{ xs: 0.5, sm: 1.5 }}>
          <LanguagePopover />
        </Stack>
      </ToolbarStyle>
    </RootStyle>
  );
}
