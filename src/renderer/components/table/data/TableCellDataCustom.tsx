import { EntityCustomColumn } from 'renderer/entity/entity';

type TableCellDataCronProps<EntityItem> = {
  row: EntityItem;
  column: EntityCustomColumn<EntityItem>;
};

export default function TableCellDataCustom<EntityItem>({ row, column }: TableCellDataCronProps<EntityItem>) {
  return <column.Component column={column} row={row} />;
}
