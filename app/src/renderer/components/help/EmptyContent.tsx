import { styled } from '@mui/material/styles';
import { Typography, Box, BoxProps } from '@mui/material';
import { ReactNode } from 'react';
import { IconViewer, MUIconType } from '../common/IconViewer';

const RootStyle = styled(Box)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  textAlign: 'center',
  alignItems: 'center',
  flexDirection: 'column',
  justifyContent: 'center',
  padding: theme.spacing(4, 2),
}));

interface EmptyContentProps extends BoxProps {
  text: ReactNode;
  description?: ReactNode;
  icon?: MUIconType;
}

export default function EmptyContent({ text, description, icon, ...other }: EmptyContentProps) {
  return (
    <RootStyle {...other}>
      {icon && <IconViewer icon={icon} fontSize={'large'} sx={{ mb: 1 }} />}

      <Typography variant="subtitle1" component={'div'} gutterBottom>
        {text}
      </Typography>

      {description && (
        <Typography variant="body2" component={'div'} sx={{ color: 'text.secondary' }}>
          {description}
        </Typography>
      )}
    </RootStyle>
  );
}
