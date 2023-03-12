import { EntityParsedDateColumn } from 'renderer/entity/entity';
import { get } from 'lodash';
import { useMemo } from 'react';
import { ParsedDate } from '../../../../common/generated_definitions';
import FormattedParsedDate from '../../format/FormattedParsedDate';

type TableCellDataParsedDateProps<EntityItem> = {
  row: EntityItem;
  column: EntityParsedDateColumn<EntityItem>;
};

export default function TableCellDataParsedDate<EntityItem>({ row, column }: TableCellDataParsedDateProps<EntityItem>) {
  const value = useMemo<ParsedDate | undefined>(() => get(row, column.id), [row, column]);

  return <>{!!value && <FormattedParsedDate value={value} />}</>;
}
