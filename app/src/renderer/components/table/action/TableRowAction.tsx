import { EntityRowAction } from 'renderer/entity/entity';
import { ReactNode, useMemo } from 'react';
import TableRowActionNavigate from 'renderer/components/table/action/TableRowActionNavigate';
import TableRowActionDetails from 'renderer/components/table/action/TableRowActionDetails';

export type TableRowActionProps<EntityItem> = {
  row: EntityItem;
  action: EntityRowAction<EntityItem>;
  open: boolean;
};

export default function TableRowAction<EntityItem>({ row, action, open }: TableRowActionProps<EntityItem>) {
  const actionComponent = useMemo<ReactNode>(() => {
    switch (action.type) {
      case 'Details':
        return <TableRowActionDetails row={row} action={action} open={open} />;
      case 'Navigate':
        return <TableRowActionNavigate row={row} action={action} open={open} />;
      default:
        return null;
    }
  }, [row, action, open]);

  return <>{actionComponent}</>;
}
