import * as React from 'react';
import Label from 'renderer/components/common/Label';
import { orange } from '@mui/material/colors';
import { Box } from '@mui/material';

type InlineCodeLabelProps = {
  code: string;
};

export const InlineCodeLabel: React.FC<InlineCodeLabelProps> = ({ code }) => {
  return (
    <Box
      component={'span'}
      sx={{
        display: 'inline-block',
        border: (theme) => `1px solid ${theme.palette.divider}`,
        borderRadius: 0.5,
        px: 0.5,
        color: orange[700],
        fontSize: (theme) => theme.typography.caption.fontSize,
        fontFamily: 'monospace',
      }}
    >
      {code}
    </Box>
  );
};
