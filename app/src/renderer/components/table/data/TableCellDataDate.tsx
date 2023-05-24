import { EntityDateColumn } from 'renderer/entity/entity';
import { get, isNumber, isString } from 'lodash';
import { ReactNode, useMemo } from 'react';
import { FormattedDate } from 'react-intl';

type TableCellDataDateProps<EntityItem> = {
  row: EntityItem;
  column: EntityDateColumn<EntityItem>;
};

export default function TableCellDataDate<EntityItem>({ row, column }: TableCellDataDateProps<EntityItem>) {
  const date = useMemo<ReactNode>(() => {
    let value = get(row, column.id);
    if (!value) {
      return null;
    }
    if (isString(value)) {
      const isSeconds = value.indexOf('.') > -1;
      value = parseInt(value, 10);
      if (isSeconds) {
        value *= 1000;
      }
    }
    if (!isNumber(value) || value <= 0) {
      return null;
    }
    return <FormattedDate value={value} dateStyle={'medium'} timeStyle={'medium'} />;
  }, [row, column]);

  return <>{date}</>;
}
