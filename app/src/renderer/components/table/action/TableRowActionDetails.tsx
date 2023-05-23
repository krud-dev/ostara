import { EntityRowActionDetails } from 'renderer/entity/entity';
import { Box, TableCell, TableRow } from '@mui/material';
import AutoSizer from 'react-virtualized-auto-sizer';

export type TableRowActionDetailsProps<EntityItem> = {
  row: EntityItem;
  action: EntityRowActionDetails<EntityItem>;
  open: boolean;
};

export default function TableRowActionDetails<EntityItem>({
  row,
  action,
  open,
}: TableRowActionDetailsProps<EntityItem>) {
  if (!open) {
    return null;
  }

  return (
    <>
      <TableRow />
      <TableRow sx={{ borderBottom: (theme) => `1px solid ${theme.palette.divider}` }}>
        <TableCell colSpan={999} sx={{ wordBreak: 'break-all', p: 0 }}>
          <AutoSizer disableHeight>
            {({ width }) => (
              <Box sx={{ width: width, overflow: 'hidden', px: 2 }}>
                <action.Component row={row} />
              </Box>
            )}
          </AutoSizer>
        </TableCell>
      </TableRow>
    </>
  );
}
