import { EntityChipColumn } from 'renderer/entity/entity';
import { get } from 'lodash';
import { Chip } from '@mui/material';
import { useMemo } from 'react';

type TableCellDataChipProps<EntityItem> = {
  row: EntityItem;
  column: EntityChipColumn<EntityItem>;
};

export default function TableCellDataChip<EntityItem>({ row, column }: TableCellDataChipProps<EntityItem>) {
  const value = useMemo(() => get(row, column.id), [row, column]);
  const color = useMemo(() => column.getColor(row), [value, column]);

  return <>{value && <Chip size={'small'} color={color} label={value} sx={{ pointerEvents: 'none' }} />}</>;
}
