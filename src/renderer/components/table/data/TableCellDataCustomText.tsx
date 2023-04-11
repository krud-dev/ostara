import { EntityCustomTextColumn } from 'renderer/entity/entity';
import { ReactNode, useMemo } from 'react';
import { useIntl } from 'react-intl';

type TableCellDataCustomTextProps<EntityItem> = {
  row: EntityItem;
  column: EntityCustomTextColumn<EntityItem>;
};

export default function TableCellDataCustomText<EntityItem>({ row, column }: TableCellDataCustomTextProps<EntityItem>) {
  const intl = useIntl();

  const value = useMemo<ReactNode>(() => {
    return column.getText(row, intl);
  }, [row, column]);

  return <>{value}</>;
}
