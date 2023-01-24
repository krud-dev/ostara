import { EntityLabelColumn } from 'renderer/entity/entity';
import { get } from 'lodash';
import { useMemo } from 'react';
import Label from 'renderer/components/common/Label';

type TableCellDataLabelProps<EntityItem> = {
  row: EntityItem;
  column: EntityLabelColumn<EntityItem>;
};

export default function TableCellDataLabel<EntityItem>({ row, column }: TableCellDataLabelProps<EntityItem>) {
  const value = useMemo(() => get(row, column.id), [row, column]);
  const color = useMemo(() => column.getColor(row), [value, column]);

  return (
    <>
      {value && (
        <Label color={color} sx={{ pointerEvents: 'none' }}>
          {value}
        </Label>
      )}
    </>
  );
}
