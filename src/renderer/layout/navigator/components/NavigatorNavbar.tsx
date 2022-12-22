import { experimentalStyled as styled } from '@mui/material/styles';
import { AppBar, Box, Divider, IconButton, Stack, Toolbar } from '@mui/material';
import LanguageMenu from 'renderer/layout/navigator/components/navbar/LanguageMenu';
import { NAVBAR_HEIGHT, SIDEBAR_DRAWER_WIDTH } from 'renderer/constants/ui';
import MHidden from 'renderer/components/layout/MHidden';
import { MenuOutlined } from '@mui/icons-material';

const RootStyle = styled(AppBar)(({ theme }) => ({
  minHeight: NAVBAR_HEIGHT,
  display: 'flex',
  backgroundColor: theme.palette.background.default,
  [theme.breakpoints.up('lg')]: {
    width: `calc(100% - ${SIDEBAR_DRAWER_WIDTH + 1}px)`,
  },
}));

const ToolbarStyle = styled(Toolbar)(({ theme }) => ({
  flexGrow: 1,
}));

// ----------------------------------------------------------------------

type NavigatorNavbarProps = {
  onOpenSidebar: VoidFunction;
};

export default function NavigatorNavbar({ onOpenSidebar }: NavigatorNavbarProps) {
  return (
    <RootStyle>
      <ToolbarStyle>
        <MHidden width="lgUp">
          <IconButton onClick={onOpenSidebar} size={'medium'} sx={{ mr: 1, color: 'text.primary' }}>
            <MenuOutlined fontSize={'large'} />
          </IconButton>
        </MHidden>

        <Box sx={{ flexGrow: 1 }} />

        <Stack direction="row" spacing={{ xs: 0.5, sm: 1.5 }}>
          <LanguageMenu />
        </Stack>
      </ToolbarStyle>
      <Divider />
    </RootStyle>
  );
}
