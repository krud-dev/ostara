import { EntityCountdownColumn } from 'renderer/entity/entity';
import { get, isNumber } from 'lodash';
import { useMemo } from 'react';
import { formatCountdown } from '../../../utils/formatUtils';
import { useIntl } from 'react-intl';

type TableCellDataCountdownProps<EntityItem> = {
  row: EntityItem;
  column: EntityCountdownColumn<EntityItem>;
};

export default function TableCellDataCountdown<EntityItem>({ row, column }: TableCellDataCountdownProps<EntityItem>) {
  const intl = useIntl();

  const countdown = useMemo<string>(() => {
    const value = get(row, column.id);
    if (isNumber(value)) {
      return formatCountdown(column.isSeconds ? value * 1000 : value, intl);
    }
    return value;
  }, [row, column]);

  return <>{countdown}</>;
}
