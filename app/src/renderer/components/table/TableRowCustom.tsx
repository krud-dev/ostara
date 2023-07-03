import { Box, Checkbox, TableCell, TableRow, Tooltip } from '@mui/material';
import { EntityColumn } from 'renderer/entity/entity';
import { useTableContext } from 'renderer/components/table/TableContext';
import React, { useCallback, useMemo } from 'react';
import TableCellData from 'renderer/components/table/data/TableCellData';
import TableRowAction from 'renderer/components/table/action/TableRowAction';
import { alpha } from '@mui/material/styles';
import ToolbarButton from '../common/ToolbarButton';
import { FormattedMessage } from 'react-intl';
import { isBoolean } from 'lodash';
import { useAnalyticsContext } from '../../contexts/AnalyticsContext';
import { useLocation } from 'react-router-dom';
import { getUrlInfo } from '../../utils/urlUtils';

type TableRowCustomProps<EntityItem> = {
  row: EntityItem;
  index: number;
};

export default function TableRowCustom<EntityItem>({ row, index }: TableRowCustomProps<EntityItem>) {
  const {
    entity,
    visibleColumns,
    selectedRows,
    selectRowHandler,
    isRowSelected,
    openRows,
    toggleRowOpenHandler,
    isRowOpen,
    hasActions,
    hasMassActions,
    actionsHandler,
  } = useTableContext<EntityItem, unknown>();
  const { track } = useAnalyticsContext();
  const { pathname } = useLocation();

  const [loadingActionIds, setLoadingActionIds] = React.useState<string[]>([]);

  const selected = useMemo<boolean>(() => isRowSelected(row), [row, selectedRows, isRowSelected]);
  const open = useMemo<boolean>(() => isRowOpen(row), [row, openRows, isRowOpen]);
  const hasDetailsRowAction = useMemo<boolean>(() => entity.rowAction?.type === 'Details', [entity]);
  const hasActiveRowAction = useMemo<boolean>(() => !!entity.rowAction, [entity]);
  const anchor = useMemo<string | undefined>(() => entity.getAnchor?.(row), [row, entity]);

  const rowClickHandler = useCallback(
    (event: React.MouseEvent): void => {
      if (!hasActiveRowAction) {
        return;
      }
      if (!open) {
        const urlInfo = getUrlInfo(pathname);
        track({
          name: 'table_row_expand',
          properties: { table: entity.id, page_title: urlInfo?.path, page_location: urlInfo?.url },
        });
      }
      toggleRowOpenHandler(row);
    },
    [hasActiveRowAction, open, toggleRowOpenHandler]
  );

  const checkboxClickHandler = useCallback(
    (event: React.MouseEvent): void => {
      event.stopPropagation();
      selectRowHandler(row);
    },
    [selectRowHandler]
  );

  const actionClickHandler = useCallback(
    async (event: React.MouseEvent, actionId: string): Promise<void> => {
      event.stopPropagation();

      setLoadingActionIds((prev) => [...prev, actionId]);

      track({ name: 'table_row_action', properties: { table: entity.id, action: actionId } });
      await actionsHandler(actionId, row);

      setLoadingActionIds((prev) => prev.filter((id) => id !== actionId));
    },
    [actionsHandler, setLoadingActionIds]
  );

  return (
    <>
      <TableRow
        id={anchor}
        hover
        selected={selected}
        onClick={rowClickHandler}
        sx={{
          ...(hasActiveRowAction ? { cursor: 'pointer' } : {}),
          ...(open
            ? {
                backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.08),
                '&:hover': { backgroundColor: (theme) => `${alpha(theme.palette.primary.main, 0.16)}!important` },
              }
            : {}),
        }}
      >
        {hasMassActions && (
          <TableCell padding="checkbox">
            <Checkbox checked={selected} onClick={checkboxClickHandler} />
          </TableCell>
        )}
        {hasDetailsRowAction && (
          <TableCell sx={{ pr: 0 }}>
            <ToolbarButton
              tooltip={<FormattedMessage id={open ? 'collapseDetails' : 'expandDetails'} />}
              icon={open ? 'KeyboardArrowDown' : 'KeyboardArrowRight'}
              disabled={!hasActiveRowAction}
            />
          </TableCell>
        )}

        {visibleColumns.map((column: EntityColumn<EntityItem>) => {
          const tooltip = column.getTooltip?.(row);
          return (
            <TableCell align={column.align || 'left'} sx={{ wordBreak: 'break-word' }} key={column.id}>
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
              const loading = loadingActionIds.includes(action.id);
              const showActionTooltip = !disabled || isBoolean(disabled);
              const tooltip = showActionTooltip ? <FormattedMessage id={action.labelId} /> : disabled;
              return (
                <ToolbarButton
                  tooltip={tooltip}
                  tooltipDisableInteractive={showActionTooltip}
                  icon={action.icon}
                  disabled={!!disabled || loading}
                  stopPropagation
                  onClick={(event) => actionClickHandler(event, action.id)}
                  key={action.id}
                />
              );
            })}
          </TableCell>
        )}
      </TableRow>

      {hasActiveRowAction && <TableRowAction row={row} action={entity.rowAction!} open={open} />}
    </>
  );
}
