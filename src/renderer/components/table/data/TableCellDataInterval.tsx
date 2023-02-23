import { EntityIntervalColumn } from 'renderer/entity/entity';
import { get } from 'lodash';
import { useMemo } from 'react';
import FormattedInterval from '../../format/FormattedInterval';

type TableCellDataIntervalProps<EntityItem> = {
  row: EntityItem;
  column: EntityIntervalColumn<EntityItem>;
};

export default function TableCellDataInterval<EntityItem>({ row, column }: TableCellDataIntervalProps<EntityItem>) {
  const value = useMemo<number>(() => {
    return get(row, column.id);
  }, [row, column]);

  return <FormattedInterval value={value} isSeconds={column.isSeconds} />;
}
