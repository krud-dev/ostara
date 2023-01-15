import { EntityTextColumn } from 'renderer/entity/entity';
import { get } from 'lodash';

type TableCellDataTextProps<EntityItem> = {
  row: EntityItem;
  column: EntityTextColumn<EntityItem>;
};

export default function TableCellDataText<EntityItem>({ row, column }: TableCellDataTextProps<EntityItem>) {
  return <>{get(row, column.id)}</>;
}
