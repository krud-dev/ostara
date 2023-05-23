import { EntityNumberColumn } from 'renderer/entity/entity';
import { get } from 'lodash';
import { useMemo } from 'react';
import { roundNumber } from 'renderer/utils/formatUtils';

type TableCellDataNumberProps<EntityItem> = {
  row: EntityItem;
  column: EntityNumberColumn<EntityItem>;
};

export default function TableCellDataNumber<EntityItem>({ row, column }: TableCellDataNumberProps<EntityItem>) {
  const value = useMemo<number>(() => {
    const v = get(row, column.id);
    if (column.round) {
      return roundNumber(v, column.round);
    }
    return v;
  }, [row, column]);

  return <>{value}</>;
}
