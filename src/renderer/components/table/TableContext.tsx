import React, { PropsWithChildren, useCallback, useContext, useMemo, useState } from 'react';
import { Entity } from 'renderer/entity/entity';
import { isEmpty, orderBy } from 'lodash';
import { DEFAULT_ROWS_PER_PAGE, TABLE_SCROLL_CONTAINER_ID } from 'renderer/constants/ui';
import { notEmpty } from 'renderer/utils/objectUtils';
import { BaseUseQueryResult } from 'renderer/apis/requests/base/useBaseQuery';
import { useUpdateEffect } from 'react-use';
import { getTableDisplayItems } from 'renderer/components/table/utils/tableUtils';
import { useLocalStorageState } from '../../hooks/useLocalStorageState';
import { useScrollAndHighlightElement } from '../../hooks/useScrollAndHighlightElement';

export type DisplayItem<EntityItem> =
  | { type: 'Row'; row: EntityItem }
  | { type: 'Group'; group: string; title: string; collapsed: boolean; depth: number };

export type TableContextProps<EntityItem, CustomFilters> = {
  entity: Entity<EntityItem, CustomFilters>;
  rows: EntityItem[];
  allDisplayRows: DisplayItem<EntityItem>[];
  displayRows: DisplayItem<EntityItem>[];
  selectedRows: EntityItem[];
  hasSelectedRows: boolean;
  selectRowHandler: (row: EntityItem) => void;
  isRowSelected: (row: EntityItem) => boolean;
  selectAllIndeterminate: boolean;
  selectAllChecked: boolean;
  selectAllRowsHandler: (selectAll: boolean) => void;
  toggleGroupHandler: (title: string) => void;
  openRows: EntityItem[];
  toggleRowOpenHandler: (row: EntityItem) => void;
  closeAllRowsHandler: () => void;
  isRowOpen: (row: EntityItem) => boolean;
  loading: boolean;
  empty: boolean;
  page: number;
  changePageHandler: (newPage: number) => void;
  rowsPerPage: number;
  changeRowsPerPageHandler: (newRowsPerPage: number) => void;
  filter: string;
  changeFilterHandler: (newFilter: string) => void;
  customFilters: CustomFilters;
  changeCustomFiltersHandler: (newCustomFilters?: CustomFilters) => void;
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
  queryState: BaseUseQueryResult<EntityItem[]>;
  actionsHandler: (actionId: string, row: EntityItem) => Promise<void>;
  massActionsHandler: (actionId: string, selectedRows: EntityItem[]) => Promise<void>;
  globalActionsHandler: (actionId: string) => Promise<void>;
}

function TableProvider<EntityItem, CustomFilters>({
  entity,
  queryState,
  actionsHandler,
  massActionsHandler,
  globalActionsHandler,
  children,
}: TableProviderProps<EntityItem, CustomFilters>) {
  const [filter, setFilter] = useState<string>('');
  const [customFilters, setCustomFilters] = useState<CustomFilters | undefined>(undefined);
  const [orderColumn, setOrderColumn] = useState<string | undefined>(undefined);
  const [orderDirection, setOrderDirection] = useState<'asc' | 'desc' | undefined>(undefined);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useLocalStorageState<number>('tableRowsPerPage', DEFAULT_ROWS_PER_PAGE);
  const [selected, setSelected] = useState<string[]>([]);
  const [open, setOpen] = useState<string[]>([]);
  const [collapsedGroups, setCollapsedGroups] = useState<string[]>([]);

  useUpdateEffect(() => {
    setSelected([]);
  }, [queryState.data]);

  const tableData = useMemo<EntityItem[]>(() => queryState.data ?? [], [queryState.data]);
  const filteredTableData = useMemo<EntityItem[]>(
    () =>
      orderBy(
        filter || customFilters ? entity.filterData(tableData, filter, customFilters) : tableData,
        [...(orderColumn ? [orderColumn] : []), ...entity.defaultOrder.map((o) => o.id)],
        [...(orderDirection ? [orderDirection] : []), ...entity.defaultOrder.map((o) => o.direction)]
      ),
    [entity, tableData, filter, customFilters, orderDirection, orderColumn]
  );
  const allDisplayTableData = useMemo<DisplayItem<EntityItem>[]>(
    () => getTableDisplayItems(entity, filteredTableData, collapsedGroups),
    [entity, filteredTableData, collapsedGroups]
  );
  const displayTableData = useMemo<DisplayItem<EntityItem>[]>(
    () =>
      entity.paging
        ? allDisplayTableData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
        : allDisplayTableData,
    [entity, allDisplayTableData, page, rowsPerPage]
  );

  const loading = useMemo<boolean>(() => queryState.isLoading, [queryState.isLoading]);
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

  const toggleGroupHandler = useCallback(
    (groupTitle: string): void => {
      setCollapsedGroups((currentCollapsedGroups) => {
        if (currentCollapsedGroups.includes(groupTitle)) {
          return currentCollapsedGroups.filter((title) => title !== groupTitle);
        }
        return [...currentCollapsedGroups, groupTitle];
      });
    },
    [setCollapsedGroups]
  );

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

  useUpdateEffect(() => {
    if (highlightAnchor) {
      highlightAndScroll(highlightAnchor, { containerId: TABLE_SCROLL_CONTAINER_ID });
      setHighlightAnchor(undefined);
    }
  }, [highlightAnchor]);

  const highlightHandler = useCallback(
    (anchor: string): void => {
      if (!entity.getAnchor) {
        return;
      }

      const anchorIndex = allDisplayTableData.findIndex(
        (item) => item.type === 'Row' && entity.getAnchor!(item.row) === anchor
      );
      if (anchorIndex < 0) {
        return;
      }

      const anchorPage = Math.floor(anchorIndex / rowsPerPage);
      if (anchorPage !== page) {
        changePageHandler(anchorPage);
      }

      setHighlightAnchor(anchor);
    },
    [entity, allDisplayTableData, rowsPerPage, changePageHandler, setHighlightAnchor]
  );

  return (
    <TableContext.Provider
      value={{
        entity,
        rows: filteredTableData,
        allDisplayRows: allDisplayTableData,
        displayRows: displayTableData,
        selectedRows,
        hasSelectedRows,
        selectRowHandler,
        isRowSelected,
        selectAllIndeterminate,
        selectAllChecked,
        selectAllRowsHandler,
        toggleGroupHandler,
        openRows,
        toggleRowOpenHandler,
        closeAllRowsHandler,
        isRowOpen,
        loading,
        empty,
        page,
        changePageHandler,
        rowsPerPage,
        changeRowsPerPageHandler,
        filter,
        changeFilterHandler,
        customFilters,
        changeCustomFiltersHandler,
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
