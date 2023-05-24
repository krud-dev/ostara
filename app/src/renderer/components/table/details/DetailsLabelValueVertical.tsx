import React, { ReactNode, useMemo } from 'react';
import { Box, Stack, Tooltip, Typography } from '@mui/material';
import { SxProps } from '@mui/system';
import { Theme } from '@mui/material/styles';
import { EMPTY_STRING } from '../../../constants/ui';
import { isNil } from 'lodash';

type DetailsLabelValueVerticalProps = {
  label: ReactNode;
  value: ReactNode;
  tooltip?: ReactNode;
  sx?: SxProps<Theme>;
};

export default function DetailsLabelValueVertical({ label, value, tooltip, sx }: DetailsLabelValueVerticalProps) {
  const displayValue = useMemo<ReactNode>(() => (isNil(value) ? EMPTY_STRING : value), [value]);

  return (
    <Stack sx={{ textAlign: 'left', ...sx }}>
      <Typography variant={'caption'} sx={{ color: 'text.secondary', fontWeight: 'bold', textTransform: 'uppercase' }}>
        {label}
      </Typography>
      <Typography component={'div'} variant={'body2'}>
        <Tooltip title={tooltip}>
          <Box component={'span'} sx={{ wordBreak: 'break-word' }}>
            {displayValue}
          </Box>
        </Tooltip>
      </Typography>
    </Stack>
  );
}
