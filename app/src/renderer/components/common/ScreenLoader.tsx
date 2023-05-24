import { styled } from '@mui/material/styles';
import { SxProps } from '@mui/material';
import LogoLoader from './LogoLoader';

const RootStyle = styled('div')(({ theme }) => ({
  right: 0,
  bottom: 0,
  zIndex: 99999,
  width: '100%',
  height: '100%',
  position: 'fixed',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: theme.palette.background.default,
}));

type ScreenLoaderProps = {
  sx?: SxProps;
};

export default function ScreenLoader({ ...other }: ScreenLoaderProps) {
  return (
    <RootStyle {...other}>
      <LogoLoader />
    </RootStyle>
  );
}
