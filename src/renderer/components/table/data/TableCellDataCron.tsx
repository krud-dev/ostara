import { EntityCronColumn } from 'renderer/entity/entity';
import { get } from 'lodash';
import { useMemo } from 'react';
import { useUi } from 'renderer/contexts/UiContext';
import cronstrue from 'cronstrue/i18n';
import { Box } from '@mui/material';

type TableCellDataCronProps<EntityItem> = {
  row: EntityItem;
  column: EntityCronColumn<EntityItem>;
};

export default function TableCellDataCron<EntityItem>({ row, column }: TableCellDataCronProps<EntityItem>) {
  const { localeInfo } = useUi();

  const cron = useMemo<string>(() => get(row, column.id), [row, column]);
  const prettyCron = useMemo<string>(() => cronstrue.toString(cron, { locale: localeInfo.id }), [cron]);

  return <Box component={'span'}>{prettyCron}</Box>;
}
