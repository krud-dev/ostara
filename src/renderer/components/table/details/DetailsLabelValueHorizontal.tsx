import React, { ReactNode, useMemo } from 'react';
import { Stack, Typography } from '@mui/material';
import { SxProps } from '@mui/system';
import { Theme } from '@mui/material/styles';
import { EMPTY_STRING } from '../../../constants/ui';
import { isNil } from 'lodash';

type DetailsLabelValueHorizontalProps = {
  label: ReactNode;
  value: ReactNode;
  sx?: SxProps<Theme>;
  labelSx?: SxProps<Theme>;
  valueSx?: SxProps<Theme>;
};

export default function DetailsLabelValueHorizontal({
  label,
  value,
  sx,
  labelSx,
  valueSx,
}: DetailsLabelValueHorizontalProps) {
  const displayValue = useMemo<ReactNode>(() => (isNil(value) ? EMPTY_STRING : value), [value]);

  return (
    <Stack direction="row" spacing={2} justifyContent="space-between" sx={sx}>
      <Typography variant="body2" sx={{ textAlign: 'left', color: 'text.secondary', ...labelSx }}>
        {label}
      </Typography>
      <Typography variant="subtitle2" sx={{ textAlign: 'right', ...valueSx }}>
        {displayValue}
      </Typography>
    </Stack>
  );
}
