import { EntityColumn } from 'renderer/entity/entity';
import { ReactNode, useMemo } from 'react';
import TableCellDataText from 'renderer/components/table/data/TableCellDataText';
import TableCellDataCron from 'renderer/components/table/data/TableCellDataCron';
import TableCellDataDate from 'renderer/components/table/data/TableCellDataDate';
import TableCellDataCustom from 'renderer/components/table/data/TableCellDataCustom';

type TableCellDataProps<EntityItem> = {
  row: EntityItem;
  column: EntityColumn<EntityItem>;
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
      case 'Custom':
        return <TableCellDataCustom row={row} column={column} />;
      default:
        return null;
    }
  }, [row, column]);

  return <>{data}</>;
}
