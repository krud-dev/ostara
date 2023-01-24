import React, { ReactNode, useCallback, useMemo, useRef, useState } from 'react';
import { Box, Table, TableBody, TableContainer, TablePagination, useMediaQuery } from '@mui/material';
import PerfectScrollbar from 'react-perfect-scrollbar';
import TableToolbar from 'renderer/components/table/TableToolbar';
import { BaseUseQueryResult } from 'renderer/apis/base/useBaseQuery';
import { Entity } from 'renderer/entity/entity';
import TableRowCustom from 'renderer/components/table/TableRowCustom';
import TableSelectedActions from 'renderer/components/table/TableSelectedActions';
import TableHeadCustom from 'renderer/components/table/TableHeadCustom';
import TableNoData from 'renderer/components/table/TableNoData';
import { COMPONENTS_SPACING, ROWS_PER_PAGE_OPTIONS } from 'renderer/constants/ui';
import TableSkeleton from 'renderer/components/table/TableSkeleton';
import { DisplayItem, TableContext, TableProvider } from 'renderer/components/table/TableContext';
import { useTheme } from '@mui/material/styles';
import TableRowGroup from 'renderer/components/table/TableRowGroup';
import { useWindowSize } from 'react-use';
import { isNil } from 'lodash';
import { useScrollSync } from 'renderer/hooks/useScrollSync';
import { calculateElementDocumentOffsetTop } from 'renderer/utils/elementUtils';

type TableComponentProps<EntityItem> = {
  entity: Entity<EntityItem>;
  queryState: BaseUseQueryResult<EntityItem[]>;
  actionsHandler: (actionId: string, row: EntityItem) => Promise<void>;
  massActionsHandler: (actionId: string, selectedRows: EntityItem[]) => Promise<void>;
  globalActionsHandler: (actionId: string) => Promise<void>;
};

export default function TableComponent<EntityItem>({
  entity,
  queryState,
  actionsHandler,
  massActionsHandler,
  globalActionsHandler,
}: TableComponentProps<EntityItem>) {
  const theme = useTheme();
  const showRowPerPageLabel = useMediaQuery(theme.breakpoints.up('md'));

  const renderRow = useCallback((item: DisplayItem<EntityItem>): ReactNode => {
    switch (item.type) {
      case 'Row':
        return <TableRowCustom row={item.row} key={entity.getId(item.row)} />;
      case 'Group':
        return (
          <TableRowGroup
            group={item.group}
            title={item.title}
            collapsed={item.collapsed}
            depth={item.depth}
            key={item.group}
          />
        );
      default:
        return <></>;
    }
  }, []);

  const { height } = useWindowSize();
  const [topOffset, setTopOffset] = useState<number | undefined>(undefined);

  const scrollContainerHeight = useMemo<number>(() => {
    return isNil(topOffset) ? 0 : height - topOffset - parseInt(theme.spacing(COMPONENTS_SPACING), 10);
  }, [height, topOffset]);

  const measureScrollRefOffset = useCallback((element: HTMLDivElement | null): void => {
    if (element !== null) {
      setTopOffset(calculateElementDocumentOffsetTop(element));
    }
  }, []);

  const tableHeaderScrollRef = useRef<HTMLDivElement>(null);
  const tableBodyScrollRef = useRef<any>(null);

  useScrollSync([tableHeaderScrollRef, tableBodyScrollRef], {
    horizontal: true,
    vertical: false,
    proportional: false,
    throttleWaitTime: 25,
  });

  return (
    <TableProvider
      entity={entity}
      queryState={queryState}
      actionsHandler={actionsHandler}
      massActionsHandler={massActionsHandler}
      globalActionsHandler={globalActionsHandler}
    >
      <TableContext.Consumer>
        {({
          rows,
          displayRows,
          loading,
          empty,
          page,
          changePageHandler,
          rowsPerPage,
          changeRowsPerPageHandler,
          dense,
        }) => (
          <Box>
            <TableToolbar />

            <TableContainer ref={tableHeaderScrollRef} sx={{ position: 'relative', overflow: 'hidden' }}>
              <TableSelectedActions />

              <Table size={dense ? 'small' : 'medium'}>
                <TableHeadCustom />
              </Table>
            </TableContainer>

            <Box ref={measureScrollRefOffset} sx={{ height: scrollContainerHeight }}>
              <PerfectScrollbar
                containerRef={(element) => {
                  tableBodyScrollRef.current = element;
                }}
                options={{ wheelPropagation: true }}
              >
                <TableContainer
                  sx={{
                    width: 'auto',
                    minWidth: '100%',
                    position: 'relative',
                    overflow: 'hidden',
                    display: 'inline-block',
                  }}
                >
                  <Table size={dense ? 'small' : 'medium'}>
                    <TableHeadCustom
                      sx={{ height: '0px', maxHeight: '0px', overflow: 'hidden', visibility: 'collapse' }}
                    />
                    <TableBody>
                      {loading && <TableSkeleton />}
                      {empty && <TableNoData />}
                      {displayRows.map((displayRow) => renderRow(displayRow))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </PerfectScrollbar>
            </Box>

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
          </Box>
        )}
      </TableContext.Consumer>
    </TableProvider>
  );
}
