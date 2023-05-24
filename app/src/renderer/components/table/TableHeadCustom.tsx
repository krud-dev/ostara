import { Theme } from '@mui/material/styles';
import { Box, Checkbox, SxProps, TableCell, TableHead, TableRow, TableSortLabel } from '@mui/material';
import { FormattedMessage } from 'react-intl';
import { useTable } from 'renderer/components/table/TableContext';
import { DEFAULT_TABLE_COLUMN_WIDTH } from 'renderer/constants/ui';
import React, { useMemo } from 'react';
import ToolbarButton from '../common/ToolbarButton';

const visuallyHidden = {
  border: 0,
  margin: -1,
  padding: 0,
  width: '1px',
  height: '1px',
  overflow: 'hidden',
  position: 'absolute',
  whiteSpace: 'nowrap',
  clip: 'rect(0 0 0 0)',
} as const;

type TableHeadCustomProps = {
  sx?: SxProps<Theme>;
};

export default function TableHeadCustom({ sx }: TableHeadCustomProps) {
  const {
    entity,
    selectAllIndeterminate,
    selectAllChecked,
    selectAllRowsHandler,
    closeAllRowsHandler,
    orderColumn,
    orderDirection,
    changeOrderHandler,
    hasActions,
    hasMassActions,
  } = useTable();

  const hasDetailsRowAction = useMemo<boolean>(() => entity.rowAction?.type === 'Details', [entity]);
  const actionsWidth = useMemo<number>(() => entity.actions.length * 36 + 40, [entity]);

  return (
    <TableHead sx={sx}>
      <TableRow>
        {hasMassActions && (
          <TableCell padding="checkbox" sx={{ width: '1%!important' }}>
            <Checkbox
              indeterminate={selectAllIndeterminate}
              checked={selectAllChecked}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => selectAllRowsHandler(event.target.checked)}
            />
          </TableCell>
        )}

        {hasDetailsRowAction && (
          <TableCell sx={{ width: '1%!important', pr: 0 }}>
            <ToolbarButton
              tooltip={<FormattedMessage id={'collapseAll'} />}
              icon={'UnfoldLessDoubleOutlined'}
              onClick={closeAllRowsHandler}
            />
          </TableCell>
        )}

        {entity.columns.map((column) => (
          <TableCell
            key={column.id}
            align={column.align || 'left'}
            sortDirection={orderColumn === column.id ? orderDirection : false}
            sx={{
              width: column.width || DEFAULT_TABLE_COLUMN_WIDTH,
              minWidth: column.width || DEFAULT_TABLE_COLUMN_WIDTH,
              maxWidth: column.width || DEFAULT_TABLE_COLUMN_WIDTH,
            }}
          >
            <TableSortLabel
              hideSortIcon
              active={orderColumn === column.id}
              direction={orderColumn === column.id ? orderDirection : 'asc'}
              onClick={() => changeOrderHandler(column.id)}
              sx={{ textTransform: 'capitalize' }}
            >
              <FormattedMessage id={column.labelId} />

              {orderColumn === column.id ? (
                <Box sx={{ ...visuallyHidden }}>
                  {orderDirection === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
        {hasActions && (
          <TableCell align={'right'} sx={{ minWidth: actionsWidth, width: '1%' }}>
            <FormattedMessage id={'actions'} />
          </TableCell>
        )}
      </TableRow>
    </TableHead>
  );
}
