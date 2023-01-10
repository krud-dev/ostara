import { IconButton, TableCell, TableRow, Typography } from '@mui/material';
import { useTable } from 'renderer/components/table/TableContext';
import React, { useMemo } from 'react';
import { KeyboardArrowDown, KeyboardArrowRight, SvgIconComponent } from '@mui/icons-material';
import { COMPONENTS_SPACING } from 'renderer/constants/ui';

type TableRowGroupProps<EntityItem> = {
  title: string;
  collapsed: boolean;
};

export default function TableRowGroup<EntityItem>({ title, collapsed }: TableRowGroupProps<EntityItem>) {
  const { toggleGroupHandler } = useTable<EntityItem>();

  const ToggleIcon = useMemo<SvgIconComponent>(() => (collapsed ? KeyboardArrowRight : KeyboardArrowDown), [collapsed]);

  return (
    <TableRow>
      <TableCell sx={{ pl: COMPONENTS_SPACING - 1.25, pr: 0 }}>
        <IconButton onClick={() => toggleGroupHandler(title)}>
          <ToggleIcon fontSize="small" />
        </IconButton>
      </TableCell>
      <TableCell colSpan={999}>
        <Typography variant={'subtitle2'} component={'span'}>
          {title}
        </Typography>
      </TableCell>
    </TableRow>
  );
}
