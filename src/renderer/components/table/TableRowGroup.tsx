import { darken, IconButton, Stack, TableCell, TableRow, Typography } from '@mui/material';
import { useTable } from 'renderer/components/table/TableContext';
import React, { useCallback, useMemo } from 'react';
import { KeyboardArrowDown, KeyboardArrowRight, SvgIconComponent } from '@mui/icons-material';
import { COMPONENTS_SPACING } from 'renderer/constants/ui';

type TableRowGroupProps<EntityItem> = {
  group: string;
  title: string;
  collapsed: boolean;
  depth: number;
};

export default function TableRowGroup<EntityItem>({ group, title, collapsed, depth }: TableRowGroupProps<EntityItem>) {
  const { toggleGroupHandler } = useTable<EntityItem>();

  const ToggleIcon = useMemo<SvgIconComponent>(() => (collapsed ? KeyboardArrowRight : KeyboardArrowDown), [collapsed]);

  const toggleHandler = useCallback(
    (event: React.MouseEvent) => {
      event.stopPropagation();
      toggleGroupHandler(group);
    },
    [group, toggleGroupHandler]
  );

  return (
    <TableRow
      hover
      onClick={toggleHandler}
      sx={{ cursor: 'pointer', backgroundColor: (theme) => theme.palette.action.alternate }}
    >
      <TableCell colSpan={999} sx={{ wordBreak: 'break-all', pl: COMPONENTS_SPACING - 0.875 + depth * 5, pr: 0 }}>
        <Stack direction={'row'} spacing={1} alignItems={'center'}>
          <IconButton size={'small'} onClick={toggleHandler}>
            <ToggleIcon fontSize="small" />
          </IconButton>

          <Typography variant={'subtitle2'} component={'span'}>
            {title}
          </Typography>
        </Stack>
      </TableCell>
    </TableRow>
  );
}
