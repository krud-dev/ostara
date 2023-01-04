import { EntityColumn } from 'renderer/entity/entity';
import { ReactNode, useMemo } from 'react';
import TableCellDataText from 'renderer/components/table/data/TableCellDataText';
import TableCellDataCron from 'renderer/components/table/data/TableCellDataCron';
import TableCellDataDate from 'renderer/components/table/data/TableCellDataDate';

type TableCellDataProps<EntityItem> = {
  row: EntityItem;
  column: EntityColumn;
};

export default function TableCellData<EntityItem>({ row, column }: TableCellDataProps<EntityItem>) {
  const data = useMemo<ReactNode>(() => {
    switch (column.type) {
      case 'Text':
        return <TableCellDataText row={row} column={column} />;
      case 'Cron':
        return <TableCellDataCron row={row} column={column} />;
      case 'Date':
        return <TableCellDataDate row={row} column={column} />;
      default:
        return null;
    }
  }, [row, column]);

  return <>{data}</>;
}
