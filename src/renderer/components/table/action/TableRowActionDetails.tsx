import { EntityRowActionDetails } from 'renderer/entity/entity';
import { TableCell, TableRow } from '@mui/material';

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
      <TableRow>
        <TableCell colSpan={999} sx={{ wordBreak: 'break-all' }}>
          <action.Component row={row} />
        </TableCell>
      </TableRow>
    </>
  );
}
