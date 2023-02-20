import { EntityBytesColumn } from 'renderer/entity/entity';
import { get, isNumber } from 'lodash';
import { useMemo } from 'react';
import { formatBytes } from '../../../utils/formatUtils';

type TableCellDataBytesProps<EntityItem> = {
  row: EntityItem;
  column: EntityBytesColumn<EntityItem>;
};

export default function TableCellDataBytes<EntityItem>({ row, column }: TableCellDataBytesProps<EntityItem>) {
  const bytes = useMemo<string>(() => {
    const value = get(row, column.id);
    if (isNumber(value)) {
      return formatBytes(value);
    }
    return value;
  }, [row, column]);

  return <>{bytes}</>;
}
