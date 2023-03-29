import { EntityCustomTextColumn } from 'renderer/entity/entity';
import { ReactNode, useMemo } from 'react';

type TableCellDataCustomTextProps<EntityItem> = {
  row: EntityItem;
  column: EntityCustomTextColumn<EntityItem>;
};

export default function TableCellDataCustomText<EntityItem>({ row, column }: TableCellDataCustomTextProps<EntityItem>) {
  const value = useMemo<ReactNode>(() => {
    return column.getText(row);
  }, [row, column]);

  return <>{value}</>;
}
