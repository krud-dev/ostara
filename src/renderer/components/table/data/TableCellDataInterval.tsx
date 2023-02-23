import { EntityIntervalColumn } from 'renderer/entity/entity';
import { get, isNumber } from 'lodash';
import { useMemo } from 'react';
import { formatInterval } from '../../../utils/formatUtils';
import { useIntl } from 'react-intl';

type TableCellDataIntervalProps<EntityItem> = {
  row: EntityItem;
  column: EntityIntervalColumn<EntityItem>;
};

export default function TableCellDataInterval<EntityItem>({ row, column }: TableCellDataIntervalProps<EntityItem>) {
  const intl = useIntl();

  const interval = useMemo<string>(() => {
    const value = get(row, column.id);
    if (isNumber(value)) {
      return formatInterval(column.isSeconds ? value * 1000 : value, intl);
    }
    return value;
  }, [row, column]);

  return <>{interval}</>;
}
