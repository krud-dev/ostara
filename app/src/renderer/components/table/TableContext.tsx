import React, { PropsWithChildren, ReactNode, useCallback, useContext, useMemo, useState } from 'react';
import { Entity, EntityColumn } from 'renderer/entity/entity';
import { isEmpty, orderBy } from 'lodash';
import { DEFAULT_ROWS_PER_PAGE, TABLE_SCROLL_CONTAINER_ID } from 'renderer/constants/ui';
import { notEmpty } from 'renderer/utils/objectUtils';
import { useUpdateEffect } from 'react-use';
import { useLocalStorageState } from '../../hooks/useLocalStorageState';
import { useScrollAndHighlightElement } from '../../hooks/useScrollAndHighlightElement';
import { useSnackbar } from 'notistack';
import { FormattedMessage } from 'react-intl';
import { Button } from '@mui/material';
import useDelayedEffect from '../../hooks/useDelayedEffect';

export type TableContextProps<EntityItem, CustomFilters> = {
  entity: Entity<EntityItem, CustomFilters>;
  visibleColumns: EntityColumn<EntityItem>[];
  rows: EntityItem[];
  displayRows: EntityItem[];
  refreshHandler: () => void;
  selectedRows: EntityItem[];
  hasSelectedRows: boolean;
  selectRowHandler: (row: EntityItem) => void;
  isRowSelected: (row: EntityItem) => boolean;
  selectAllIndeterminate: boolean;
  selectAllChecked: boolean;
  selectAllRowsHandler: (selectAll: boolean) => void;
  openRows: EntityItem[];
  toggleRowOpenHandler: (row: EntityItem) => void;
  closeAllRowsHandler: () => void;
  isRowOpen: (row: EntityItem) => boolean;
  loading: boolean;
  empty: boolean;
  emptyContent?: ReactNode;
  page: number;
  changePageHandler: (newPage: number) => void;
  rowsPerPage: number;
  changeRowsPerPageHandler: (newRowsPerPage: number) => void;
  filter: string;
  changeFilterHandler: (newFilter: string) => void;
  customFilters: CustomFilters;
  changeCustomFiltersHandler: (newCustomFilters?: CustomFilters) => void;
  clearFiltersHandler: () => void;
  orderColumn: string | undefined;
  orderDirection: 'asc' | 'desc' | undefined;
  changeOrderHandler: (columnId: string) => void;
  hasActions: boolean;
  hasMassActions: boolean;
  hasGlobalActions: boolean;
  actionsHandler: (actionId: string, row: EntityItem) => Promise<void>;
  massActionsHandler: (actionId: string, selectedRows: EntityItem[]) => Promise<void>;
  globalActionsHandler: (actionId: string) => Promise<void>;
  highlightHandler: (anchor: string) => void;
};

const TableContext = React.createContext<TableContextProps<any, any>>(undefined!);

interface TableProviderProps<EntityItem, CustomFilters> extends PropsWithChildren<any> {
  entity: Entity<EntityItem, CustomFilters>;
  hiddenColumnIds?: string[];
  data?: EntityItem[];
  loading: boolean;
  emptyContent?: ReactNode;
  refetchHandler: () => void;
  actionsHandler: (actionId: string, row: EntityItem) => Promise<void>;
  massActionsHandler: (actionId: string, selectedRows: EntityItem[]) => Promise<void>;
  globalActionsHandler: (actionId: string) => Promise<void>;
}

function TableProvider<EntityItem, CustomFilters>({
  entity,
  hiddenColumnIds,
  data,
  loading,
  emptyContent,
  refetchHandler,
  actionsHandler,
  massActionsHandler,
  globalActionsHandler,
  children,
}: TableProviderProps<EntityItem, CustomFilters>) {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const [filter, setFilter] = useState<string>('');
  const [customFilters, setCustomFilters] = useState<CustomFilters | undefined>(undefined);
  const [orderColumn, setOrderColumn] = useState<string | undefined>(undefined);
  const [orderDirection, setOrderDirection] = useState<'asc' | 'desc' | undefined>(undefined);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useLocalStorageState<number>('tableRowsPerPage', DEFAULT_ROWS_PER_PAGE);
  const [selected, setSelected] = useState<string[]>([]);
  const [open, setOpen] = useState<string[]>([]);

  useUpdateEffect(() => {
    setSelected((prev) => prev.filter((id) => data?.some((row) => entity.getId(row) === id) ?? false));
  }, [data]);

  const visibleColumns = useMemo<EntityColumn<EntityItem>[]>(
    () => entity.columns.filter((c) => !hiddenColumnIds?.includes(c.id)),
    [entity, hiddenColumnIds]
  );
  const tableData = useMemo<EntityItem[]>(() => data ?? [], [data]);
  const filteredTableData = useMemo<EntityItem[]>(
    () =>
      orderBy(
        filter || customFilters ? entity.filterData(tableData, filter, customFilters) : tableData,
        [...(orderColumn ? [orderColumn] : []), ...entity.defaultOrder.map((o) => o.id)],
        [...(orderDirection ? [orderDirection] : []), ...entity.defaultOrder.map((o) => o.direction)]
      ),
    [entity, tableData, filter, customFilters, orderDirection, orderColumn]
  );
  const displayTableData = useMemo<EntityItem[]>(
    () =>
      entity.paging ? filteredTableData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) : filteredTableData,
    [entity, filteredTableData, page, rowsPerPage]
  );

  const empty = useMemo<boolean>(() => !loading && !filteredTableData.length, [loading, filteredTableData]);

  const selectedRows = useMemo<EntityItem[]>(
    () => selected.map((id) => filteredTableData.find((row) => entity.getId(row) === id)).filter(notEmpty),
    [selected, entity, filteredTableData]
  );
  const hasSelectedRows = useMemo<boolean>(() => !isEmpty(selectedRows), [selectedRows]);
  const selectAllIndeterminate = useMemo<boolean>(
    () => !isEmpty(selectedRows) && selectedRows.length < filteredTableData.length,
    [selectedRows, filteredTableData]
  );
  const selectAllChecked = useMemo<boolean>(
    () => !isEmpty(selectedRows) && selectedRows.length === filteredTableData.length,
    [selectedRows, filteredTableData]
  );

  const openRows = useMemo<EntityItem[]>(
    () => open.map((id) => filteredTableData.find((row) => entity.getId(row) === id)).filter(notEmpty),
    [open, entity, filteredTableData]
  );

  const hasActions = useMemo<boolean>(() => !isEmpty(entity.actions), [entity]);
  const hasMassActions = useMemo<boolean>(() => !isEmpty(entity.massActions), [entity]);
  const hasGlobalActions = useMemo<boolean>(() => !isEmpty(entity.globalActions), [entity]);

  const refreshHandler = useCallback((): void => {
    refetchHandler();
  }, [refetchHandler]);

  const changeFilterHandler = useCallback(
    (newFilter: string): void => {
      setFilter(newFilter);
      setPage(0);
    },
    [setFilter, setPage]
  );

  const changeCustomFiltersHandler = useCallback(
    (newCustomFilters?: CustomFilters): void => {
      setCustomFilters(newCustomFilters);
      setPage(0);
    },
    [setCustomFilters, setPage]
  );

  const clearFiltersHandler = useCallback((): void => {
    setFilter('');
    setCustomFilters(undefined);
    setPage(0);
  }, [setFilter, setCustomFilters, setPage]);

  const changeOrderHandler = useCallback(
    (columnId: string): void => {
      if (orderColumn === columnId) {
        if (orderDirection === 'desc') {
          setOrderDirection('asc');
        } else {
          setOrderDirection(undefined);
          setOrderColumn(undefined);
        }
      } else {
        setOrderDirection('desc');
        setOrderColumn(columnId);
      }
    },
    [orderColumn, orderDirection, setOrderColumn, setOrderDirection]
  );

  const selectRowHandler = useCallback(
    (row: EntityItem): void => {
      const rowId = entity.getId(row);
      setSelected((prev) => (prev.includes(rowId) ? prev.filter((id) => id !== rowId) : [...prev, rowId]));
    },
    [setSelected]
  );

  const selectAllRowsHandler = useCallback(
    (selectAll: boolean): void => {
      if (selectAll) {
        setSelected(filteredTableData.map((row) => entity.getId(row)));
        return;
      }
      setSelected([]);
    },
    [setSelected, filteredTableData]
  );

  const isRowSelected = useCallback((row: EntityItem): boolean => selected.includes(entity.getId(row)), [selected]);

  const toggleRowOpenHandler = useCallback(
    (row: EntityItem): void => {
      const rowId = entity.getId(row);
      setOpen((prev) => (prev.includes(rowId) ? prev.filter((id) => id !== rowId) : [...prev, rowId]));
    },
    [setOpen, entity]
  );

  const closeAllRowsHandler = useCallback((): void => {
    setOpen([]);
  }, [setOpen]);

  const isRowOpen = useCallback((row: EntityItem): boolean => open.includes(entity.getId(row)), [open]);

  const changePageHandler = useCallback(
    (newPage: number): void => {
      setPage(newPage);
    },
    [setPage]
  );

  const changeRowsPerPageHandler = useCallback(
    (newRowsPerPage: number): void => {
      setRowsPerPage(newRowsPerPage);
      setPage(0);
    },
    [setRowsPerPage, setPage]
  );

  const highlightAndScroll = useScrollAndHighlightElement();

  const [highlightAnchor, setHighlightAnchor] = useState<string | undefined>(undefined);
  const [delayedHighlightAnchor, setDelayedHighlightAnchor] = useState<string | undefined>(undefined);

  useUpdateEffect(() => {
    if (highlightAnchor) {
      highlightAndScroll(highlightAnchor, { containerId: TABLE_SCROLL_CONTAINER_ID });
      setHighlightAnchor(undefined);
    }
  }, [highlightAnchor]);

  useDelayedEffect(() => {
    if (delayedHighlightAnchor) {
      highlightHandler(delayedHighlightAnchor);
      setDelayedHighlightAnchor(undefined);
    }
  }, [delayedHighlightAnchor]);

  const highlightHandler = useCallback(
    (anchor: string): void => {
      if (!entity.getAnchor) {
        return;
      }

      const anchorIndex = filteredTableData.findIndex((row) => entity.getAnchor!(row) === anchor);
      if (anchorIndex < 0) {
        const allDataAnchorIndex = tableData.findIndex((row) => entity.getAnchor!(row) === anchor);
        if (allDataAnchorIndex >= 0) {
          const key = enqueueSnackbar(<FormattedMessage id="selectedItemIsFiltered" />, {
            variant: 'info',
            action: (
              <Button
                color={'info'}
                size={'small'}
                variant={'outlined'}
                onClick={() => {
                  closeSnackbar(key);
                  clearFiltersHandler();
                  setDelayedHighlightAnchor(anchor);
                }}
              >
                <FormattedMessage id={'clearFilters'} />
              </Button>
            ),
          });
        }
        return;
      }

      const anchorPage = Math.floor(anchorIndex / rowsPerPage);
      if (anchorPage !== page) {
        changePageHandler(anchorPage);
      }

      setHighlightAnchor(anchor);
    },
    [
      entity,
      filteredTableData,
      rowsPerPage,
      clearFiltersHandler,
      setDelayedHighlightAnchor,
      changePageHandler,
      setHighlightAnchor,
    ]
  );

  return (
    <TableContext.Provider
      value={{
        entity,
        visibleColumns,
        rows: filteredTableData,
        displayRows: displayTableData,
        refreshHandler,
        selectedRows,
        hasSelectedRows,
        selectRowHandler,
        isRowSelected,
        selectAllIndeterminate,
        selectAllChecked,
        selectAllRowsHandler,
        openRows,
        toggleRowOpenHandler,
        closeAllRowsHandler,
        isRowOpen,
        loading,
        empty,
        emptyContent,
        page,
        changePageHandler,
        rowsPerPage,
        changeRowsPerPageHandler,
        filter,
        changeFilterHandler,
        customFilters,
        changeCustomFiltersHandler,
        clearFiltersHandler,
        orderColumn,
        orderDirection,
        changeOrderHandler,
        hasActions,
        hasMassActions,
        hasGlobalActions,
        actionsHandler,
        massActionsHandler,
        globalActionsHandler,
        highlightHandler,
      }}
    >
      {children}
    </TableContext.Provider>
  );
}

function useTable<EntityItem, CustomFilters>(): TableContextProps<EntityItem, CustomFilters> {
  const context = useContext(TableContext);

  if (!context) throw new Error('TableContext must be used inside TableProvider');

  return context;
}

export { TableContext, TableProvider, useTable };
