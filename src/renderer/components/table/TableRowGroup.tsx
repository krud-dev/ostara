import { IconButton, TableCell, TableRow, Typography } from '@mui/material';
import { useTable } from 'renderer/components/table/TableContext';
import React, { useMemo } from 'react';
import { KeyboardArrowDown, KeyboardArrowRight, SvgIconComponent } from '@mui/icons-material';
import { COMPONENTS_SPACING } from 'renderer/constants/ui';
import { alpha } from '@mui/material/styles';
import { darken } from '@mui/system/colorManipulator';

type TableRowGroupProps<EntityItem> = {
  title: string;
  collapsed: boolean;
};

export default function TableRowGroup<EntityItem>({ title, collapsed }: TableRowGroupProps<EntityItem>) {
  const { toggleGroupHandler } = useTable<EntityItem>();

  const ToggleIcon = useMemo<SvgIconComponent>(() => (collapsed ? KeyboardArrowRight : KeyboardArrowDown), [collapsed]);

  return (
    <TableRow>
      <TableCell colSpan={999} sx={{ pl: COMPONENTS_SPACING - 1.25, pr: 0 }}>
        <IconButton onClick={() => toggleGroupHandler(title)} sx={{ mr: 1 }}>
          <ToggleIcon fontSize="small" />
        </IconButton>

        <Typography variant={'subtitle2'} component={'span'}>
          {title}
        </Typography>
      </TableCell>
    </TableRow>
  );
}
