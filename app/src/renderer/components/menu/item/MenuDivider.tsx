import React from 'react';
import { DividerProps } from '@mui/material';
import Divider from '@mui/material/Divider';

export type MenuDividerProps = DividerProps;

export default function MenuDivider({ sx, ...props }: MenuDividerProps) {
  return <Divider sx={{ my: 1, ...sx }} {...props} />;
}
