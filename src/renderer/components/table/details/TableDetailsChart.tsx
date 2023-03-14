import React, { ReactNode } from 'react';
import { Box, Typography } from '@mui/material';
import { SxProps } from '@mui/system';
import { Theme } from '@mui/material/styles';
import LogoLoader from '../../common/LogoLoader';

type TableDetailsChartProps = {
  title?: ReactNode;
  chart?: ReactNode;
  sx?: SxProps<Theme>;
};

export default function TableDetailsChart({ title, chart, sx }: TableDetailsChartProps) {
  return (
    <Box sx={{ width: '100%', textAlign: 'center', ...sx }}>
      {title && (
        <Typography variant={'subtitle2'} gutterBottom>
          {title}
        </Typography>
      )}
      <Box>{chart || <LogoLoader sx={{ my: 5 }} />}</Box>
    </Box>
  );
}
