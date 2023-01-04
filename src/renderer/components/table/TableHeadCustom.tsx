import { Theme } from '@mui/material/styles';
import { Box, Checkbox, SxProps, TableCell, TableHead, TableRow, TableSortLabel } from '@mui/material';
import { FormattedMessage } from 'react-intl';
import { useTable } from 'renderer/components/table/TableContext';

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
    orderColumn,
    orderDirection,
    changeOrderHandler,
    hasActions,
    hasMassActions,
  } = useTable();

  return (
    <TableHead sx={sx}>
      <TableRow>
        {hasMassActions && (
          <TableCell padding="checkbox">
            <Checkbox
              indeterminate={selectAllIndeterminate}
              checked={selectAllChecked}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => selectAllRowsHandler(event.target.checked)}
            />
          </TableCell>
        )}

        {entity.columns.map((column) => (
          <TableCell
            key={column.id}
            align={column.align || 'left'}
            sortDirection={orderColumn === column.id ? orderDirection : false}
            sx={{ width: column.width, minWidth: column.minWidth || 150 }}
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
          <TableCell align={'right'}>
            <FormattedMessage id={'actions'} />
          </TableCell>
        )}
      </TableRow>
    </TableHead>
  );
}
