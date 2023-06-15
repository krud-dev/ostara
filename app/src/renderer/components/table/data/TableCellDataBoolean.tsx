import { EntityBooleanColumn, EntityNumberColumn } from 'renderer/entity/entity';
import { get } from 'lodash';
import { useMemo } from 'react';
import { roundNumber } from 'renderer/utils/formatUtils';
import { FormattedMessage } from 'react-intl';

type TableCellDataBooleanProps<EntityItem> = {
  row: EntityItem;
  column: EntityBooleanColumn<EntityItem>;
};

export default function TableCellDataBoolean<EntityItem>({ row, column }: TableCellDataBooleanProps<EntityItem>) {
  const valueLabelId = useMemo<string>(() => {
    const v = get(row, column.id);
    return v ? 'yes' : 'no';
  }, [row, column]);

  return (
    <>
      <FormattedMessage id={valueLabelId} />
    </>
  );
}
