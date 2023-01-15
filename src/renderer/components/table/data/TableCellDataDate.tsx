import { EntityDateColumn } from 'renderer/entity/entity';
import { get } from 'lodash';
import { useMemo } from 'react';
import { FormattedDate } from 'react-intl';

type TableCellDataDateProps<EntityItem> = {
  row: EntityItem;
  column: EntityDateColumn<EntityItem>;
};

export default function TableCellDataDate<EntityItem>({ row, column }: TableCellDataDateProps<EntityItem>) {
  const date = useMemo<number>(() => get(row, column.id), [row, column]);
  return <FormattedDate value={date} dateStyle={'medium'} timeStyle={'medium'} />;
}
