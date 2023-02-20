import { EntityDateColumn } from 'renderer/entity/entity';
import { get } from 'lodash';
import { ReactNode, useMemo } from 'react';
import { FormattedDate } from 'react-intl';

type TableCellDataDateProps<EntityItem> = {
  row: EntityItem;
  column: EntityDateColumn<EntityItem>;
};

export default function TableCellDataDate<EntityItem>({ row, column }: TableCellDataDateProps<EntityItem>) {
  const date = useMemo<ReactNode>(() => {
    const value = get(row, column.id);
    return value ? <FormattedDate value={value} dateStyle={'medium'} timeStyle={'medium'} /> : null;
  }, [row, column]);

  return <>{date}</>;
}
