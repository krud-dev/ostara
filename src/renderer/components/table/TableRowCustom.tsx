import { Box, Checkbox, IconButton, TableCell, TableRow, Tooltip } from '@mui/material';
import { EntityColumn } from 'renderer/entity/entity';
import { get } from 'lodash';
import { IconViewer } from 'renderer/components/icon/IconViewer';
import { FormattedMessage } from 'react-intl';
import { useTable } from 'renderer/components/table/TableContext';
import { useMemo } from 'react';
import TableCellData from 'renderer/components/table/data/TableCellData';

type TableRowCustomProps<EntityItem> = {
  row: EntityItem;
};

export default function TableRowCustom<EntityItem>({ row }: TableRowCustomProps<EntityItem>) {
  const { entity, selectedRows, selectRowHandler, isRowSelected, hasActions, hasMassActions, actionsHandler } =
    useTable<EntityItem>();

  const selected = useMemo<boolean>(() => isRowSelected(row), [row, selectedRows, isRowSelected]);

  return (
    <TableRow hover selected={selected}>
      {hasMassActions && (
        <TableCell padding="checkbox">
          <Checkbox checked={selected} onClick={() => selectRowHandler(row)} />
        </TableCell>
      )}

      {entity.columns.map((column: EntityColumn) => {
        const tooltip = column.tooltipId ? get(row, column.tooltipId) : '';
        return (
          <TableCell align={column.align || 'left'} key={column.id}>
            <Tooltip title={tooltip} disableInteractive={false}>
              <Box component={'span'}>
                <TableCellData row={row} column={column} />
              </Box>
            </Tooltip>
          </TableCell>
        );
      })}

      {hasActions && (
        <TableCell align="right" sx={{ whiteSpace: 'nowrap' }}>
          {entity.actions.map((action) => (
            <Tooltip title={<FormattedMessage id={action.labelId} />} key={action.id}>
              <IconButton onClick={() => actionsHandler(action.id, row)}>
                <IconViewer icon={action.icon} fontSize={'small'} />
              </IconButton>
            </Tooltip>
          ))}
        </TableCell>
      )}
    </TableRow>
  );
}
