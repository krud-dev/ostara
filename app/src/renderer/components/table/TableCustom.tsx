import React, { useMemo, useRef } from 'react';
import { Box, Table, TableBody, TableContainer, TablePagination, useMediaQuery } from '@mui/material';
import PerfectScrollbar from 'react-perfect-scrollbar';
import TableToolbar from 'renderer/components/table/TableToolbar';
import TableRowCustom from 'renderer/components/table/TableRowCustom';
import TableSelectedActions from 'renderer/components/table/TableSelectedActions';
import TableHeadCustom from 'renderer/components/table/TableHeadCustom';
import TableNoData from 'renderer/components/table/TableNoData';
import {
  COMPONENTS_SPACING,
  ROWS_PER_PAGE_OPTIONS,
  TABLE_PAGINATION_HEIGHT,
  TABLE_SCROLL_CONTAINER_ID,
} from 'renderer/constants/ui';
import { useTable } from 'renderer/components/table/TableContext';
import { useTheme } from '@mui/material/styles';
import { useScrollSync } from 'renderer/hooks/useScrollSync';
import useElementDocumentHeight from 'renderer/hooks/useElementDocumentHeight';
import { useUpdateEffect } from 'react-use';
import LogoLoader from '../common/LogoLoader';

type TableCustomProps<EntityItem> = {};

export default function TableCustom<EntityItem>({}: TableCustomProps<EntityItem>) {
  const { entity, displayRows, rows, loading, empty, page, changePageHandler, rowsPerPage, changeRowsPerPageHandler } =
    useTable<EntityItem, unknown>();
  const theme = useTheme();
  const showRowPerPage = useMediaQuery(theme.breakpoints.up('md'));

  const bottomOffset = useMemo<number>(
    () => parseInt(theme.spacing(COMPONENTS_SPACING), 10) + (entity.paging ? TABLE_PAGINATION_HEIGHT : 0),
    [entity]
  );
  const { elementHeight, elementRef } = useElementDocumentHeight({ bottomOffset });

  const tableHeaderScrollRef = useRef<HTMLDivElement>(null);
  const tableBodyScrollRef = useRef<any>(null);

  useScrollSync([tableHeaderScrollRef, tableBodyScrollRef], {
    horizontal: true,
    vertical: false,
    proportional: false,
    throttleWaitTime: 25,
  });

  useUpdateEffect(() => {
    if (tableBodyScrollRef.current) {
      tableBodyScrollRef.current.scrollTop = 0;
    }
  }, [page]);

  return (
    <Box>
      <TableToolbar />

      <TableContainer ref={tableHeaderScrollRef} sx={{ position: 'relative', overflow: 'hidden' }}>
        <TableSelectedActions />

        <Table>
          <TableHeadCustom />
        </Table>
      </TableContainer>

      <Box ref={elementRef} sx={{ height: elementHeight }}>
        <PerfectScrollbar
          id={TABLE_SCROLL_CONTAINER_ID}
          containerRef={(element) => {
            tableBodyScrollRef.current = element;
          }}
          options={{ wheelPropagation: true }}
        >
          {loading ? (
            <Box
              sx={{
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <LogoLoader />
            </Box>
          ) : (
            <TableContainer
              sx={{
                width: 'auto',
                minWidth: '100%',
                minHeight: 200,
                position: 'relative',
                overflow: 'hidden',
                display: 'inline-block',
              }}
            >
              <Table>
                <TableHeadCustom sx={{ height: '0px', maxHeight: '0px', overflow: 'hidden', visibility: 'collapse' }} />
                <TableBody>
                  {empty && <TableNoData />}
                  {displayRows.map((row) => (
                    <TableRowCustom row={row} key={entity.getId(row)} />
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </PerfectScrollbar>
      </Box>

      {entity.paging && (
        <Box sx={{ position: 'relative' }}>
          <TablePagination
            rowsPerPageOptions={showRowPerPage ? ROWS_PER_PAGE_OPTIONS : []}
            component="div"
            count={rows.length}
            rowsPerPage={rowsPerPage}
            labelRowsPerPage={showRowPerPage ? undefined : ''}
            page={page}
            showFirstButton
            showLastButton
            onPageChange={(event, newPage) => changePageHandler(newPage)}
            onRowsPerPageChange={(event) => changeRowsPerPageHandler(parseInt(event.target.value, 10))}
            sx={{ height: TABLE_PAGINATION_HEIGHT, overflow: 'hidden' }}
          />
        </Box>
      )}
    </Box>
  );
}
