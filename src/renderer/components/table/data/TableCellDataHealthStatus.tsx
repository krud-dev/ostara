import { EntityBaseColumn } from 'renderer/entity/entity';
import { useMemo } from 'react';
import { getItemHealthStatusColor, getItemHealthStatusTextId } from 'renderer/utils/itemUtils';
import { FormattedMessage } from 'react-intl';
import { Box } from '@mui/material';
import { ItemRO } from '../../../definitions/daemon';

type TableCellDataHealthStatusProps<EntityItem extends ItemRO> = {
  row: EntityItem;
  column: EntityBaseColumn<EntityItem>;
};

export default function TableCellDataHealthStatus<EntityItem extends ItemRO>({
  row,
  column,
}: TableCellDataHealthStatusProps<EntityItem>) {
  const healthStatusColor = useMemo<string | undefined>(() => getItemHealthStatusColor(row), [row]);
  const healthTextId = useMemo<string | undefined>(() => getItemHealthStatusTextId(row), [row]);
  return (
    <Box component={'span'} sx={{ color: healthStatusColor }}>
      <FormattedMessage id={healthTextId} />
    </Box>
  );
}
