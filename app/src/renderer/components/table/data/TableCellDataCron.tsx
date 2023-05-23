import { EntityCronColumn } from 'renderer/entity/entity';
import { get } from 'lodash';
import { useMemo } from 'react';
import { Box } from '@mui/material';
import FormattedCron from '../../format/FormattedCron';

type TableCellDataCronProps<EntityItem> = {
  row: EntityItem;
  column: EntityCronColumn<EntityItem>;
};

export default function TableCellDataCron<EntityItem>({ row, column }: TableCellDataCronProps<EntityItem>) {
  const cron = useMemo<string>(() => get(row, column.id), [row, column]);

  return (
    <Box component={'span'}>
      <FormattedCron value={cron} />
    </Box>
  );
}
