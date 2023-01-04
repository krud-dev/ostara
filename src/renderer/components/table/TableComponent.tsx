import React from 'react';
import { Box, Card, Table, TableBody, TableContainer, TablePagination, useMediaQuery } from '@mui/material';
import PerfectScrollbar from 'react-perfect-scrollbar';
import TableToolbar from 'renderer/components/table/TableToolbar';
import { BaseUseQueryResult } from 'renderer/apis/base/useBaseQuery';
import { Entity } from 'renderer/entity/entity';
import TableRowCustom from 'renderer/components/table/TableRowCustom';
import TableSelectedActions from 'renderer/components/table/TableSelectedActions';
import TableHeadCustom from 'renderer/components/table/TableHeadCustom';
import TableNoData from 'renderer/components/table/TableNoData';
import { ROWS_PER_PAGE_OPTIONS } from 'renderer/constants/ui';
import TableSkeleton from 'renderer/components/table/TableSkeleton';
import { TableContext, TableProvider } from 'renderer/components/table/TableContext';
import { useTheme } from '@mui/material/styles';

type TableComponentProps<EntityItem> = {
  entity: Entity<EntityItem>;
  queryState: BaseUseQueryResult<EntityItem[]>;
  actionsHandler: (actionId: string, row: EntityItem) => Promise<void>;
  massActionsHandler: (actionId: string, selectedRows: EntityItem[]) => Promise<void>;
};

export default function TableComponent<EntityItem>({
  entity,
  queryState,
  actionsHandler,
  massActionsHandler,
}: TableComponentProps<EntityItem>) {
  const theme = useTheme();
  const showRowPerPageLabel = useMediaQuery(theme.breakpoints.up('md'));

  return (
    <TableProvider
      entity={entity}
      queryState={queryState}
      actionsHandler={actionsHandler}
      massActionsHandler={massActionsHandler}
    >
      <TableContext.Consumer>
        {({
          rows,
          visibleRows,
          loading,
          empty,
          page,
          changePageHandler,
          rowsPerPage,
          changeRowsPerPageHandler,
          dense,
        }) => (
          <Card>
            <TableToolbar />

            <PerfectScrollbar options={{ suppressScrollY: true, wheelPropagation: true }}>
              <TableContainer
                sx={{
                  width: 'auto',
                  minWidth: '100%',
                  position: 'relative',
                  overflow: 'auto',
                  display: 'inline-flex',
                }}
              >
                <TableSelectedActions />

                <Table size={dense ? 'small' : 'medium'}>
                  <TableHeadCustom />

                  <TableBody>
                    {loading && <TableSkeleton />}
                    {empty && <TableNoData />}
                    {visibleRows.map((row) => (
                      <TableRowCustom row={row} key={entity.getId(row)} />
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </PerfectScrollbar>

            {entity.paging && (
              <Box sx={{ position: 'relative' }}>
                <TablePagination
                  rowsPerPageOptions={ROWS_PER_PAGE_OPTIONS}
                  component="div"
                  count={rows.length}
                  rowsPerPage={rowsPerPage}
                  labelRowsPerPage={showRowPerPageLabel ? undefined : ''}
                  page={page}
                  onPageChange={(event, newPage) => changePageHandler(newPage)}
                  onRowsPerPageChange={(event) => changeRowsPerPageHandler(parseInt(event.target.value, 10))}
                  sx={{ overflow: 'hidden' }}
                />
              </Box>
            )}
          </Card>
        )}
      </TableContext.Consumer>
    </TableProvider>
  );
}
