import React, { ReactNode } from 'react';
import { Box, Tooltip, Typography } from '@mui/material';
import { SxProps } from '@mui/system';
import { Theme } from '@mui/material/styles';
import { EMPTY_STRING } from '../../../constants/ui';

type TableDetailsLabelValueProps = {
  label: ReactNode;
  value: ReactNode;
  tooltip?: ReactNode;
  sx?: SxProps<Theme>;
};

export default function TableDetailsLabelValue({ label, value, tooltip, sx }: TableDetailsLabelValueProps) {
  return (
    <Box sx={{ textAlign: 'left', ...sx }}>
      <Typography variant={'caption'} sx={{ color: 'text.secondary', fontWeight: 'bold', textTransform: 'uppercase' }}>
        {label}
      </Typography>
      <Typography variant={'body2'}>
        <Tooltip title={tooltip}>
          <Box component={'span'}>{value || EMPTY_STRING}</Box>
        </Tooltip>
      </Typography>
    </Box>
  );
}
