import * as React from 'react';
import Label from 'renderer/components/common/Label';
import { orange } from '@mui/material/colors';

type InlineCodeLabelProps = {
  code: string;
};

export const InlineCodeLabel: React.FC<InlineCodeLabelProps> = ({ code }) => {
  return (
    <Label
      color={'default'}
      variant={'outlined'}
      sx={{ color: orange[700], fontWeight: 'normal', fontFamily: 'monospace' }}
    >
      {code}
    </Label>
  );
};
