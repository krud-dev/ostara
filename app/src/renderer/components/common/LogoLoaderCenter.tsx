import { Box, SxProps } from '@mui/material';
import React from 'react';
import LogoLoader from './LogoLoader';

type LogoLoaderCenterProps = {
  sx?: SxProps;
};

export default function LogoLoaderCenter({ sx }: LogoLoaderCenterProps) {
  return (
    <Box sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', ...sx }}>
      <LogoLoader />
    </Box>
  );
}
