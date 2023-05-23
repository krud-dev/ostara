import { styled } from '@mui/material/styles';
import { Typography, Box, BoxProps } from '@mui/material';
import { ReactNode } from 'react';

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
}

export default function EmptyContent({ text, description, ...other }: EmptyContentProps) {
  return (
    <RootStyle {...other}>
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
