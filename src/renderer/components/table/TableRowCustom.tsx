import { Box, Checkbox, IconButton, TableCell, TableRow, Tooltip } from '@mui/material';
import { EntityColumn } from 'renderer/entity/entity';
import { IconViewer } from 'renderer/components/common/IconViewer';
import { FormattedMessage } from 'react-intl';
import { useTable } from 'renderer/components/table/TableContext';
import React, { useCallback, useMemo, useState } from 'react';
import TableCellData from 'renderer/components/table/data/TableCellData';
import TableRowAction from 'renderer/components/table/action/TableRowAction';

type TableRowCustomProps<EntityItem> = {
  row: EntityItem;
};

export default function TableRowCustom<EntityItem>({ row }: TableRowCustomProps<EntityItem>) {
  const { entity, selectedRows, selectRowHandler, isRowSelected, hasActions, hasMassActions, actionsHandler } =
    useTable<EntityItem>();

  const [open, setOpen] = useState<boolean>(false);

  const selected = useMemo<boolean>(() => isRowSelected(row), [row, selectedRows, isRowSelected]);
  const hasRowAction = useMemo<boolean>(
    () => !!entity.rowAction && (!entity.isRowActionActive || entity.isRowActionActive(row)),
    [entity, row]
  );
  const anchor = useMemo<string | undefined>(() => entity.getAnchor?.(row), [row, entity]);

  const rowClickHandler = useCallback((event: React.MouseEvent): void => {
    setOpen((prev) => !prev);
  }, []);

  const checkboxClickHandler = useCallback(
    (event: React.MouseEvent): void => {
      event.stopPropagation();
      selectRowHandler(row);
    },
    [selectRowHandler]
  );

  const actionClickHandler = useCallback(
    (event: React.MouseEvent, actionId: string): void => {
      event.stopPropagation();
      actionsHandler(actionId, row);
    },
    [actionsHandler]
  );

  return (
    <>
      <TableRow
        id={anchor}
        hover
        selected={selected}
        onClick={rowClickHandler}
        sx={{ ...(hasRowAction ? { cursor: 'pointer' } : {}) }}
      >
        {hasMassActions && (
          <TableCell padding="checkbox">
            <Checkbox checked={selected} onClick={checkboxClickHandler} />
          </TableCell>
        )}

        {entity.columns.map((column: EntityColumn<EntityItem>) => {
          const tooltip = column.getTooltip?.(row);
          return (
            <TableCell align={column.align || 'left'} sx={{ wordBreak: 'break-all' }} key={column.id}>
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
            {entity.actions.map((action) => {
              const disabled = action.isDisabled?.(row);
              return (
                <Tooltip title={<FormattedMessage id={action.labelId} />} key={action.id}>
                  <Box component={'span'}>
                    <IconButton onClick={(event) => actionClickHandler(event, action.id)} disabled={disabled}>
                      <IconViewer icon={action.icon} fontSize={'small'} />
                    </IconButton>
                  </Box>
                </Tooltip>
              );
            })}
          </TableCell>
        )}
      </TableRow>

      {hasRowAction && <TableRowAction row={row} action={entity.rowAction!} open={open} />}
    </>
  );
}
