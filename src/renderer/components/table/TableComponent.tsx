import React from 'react';
import { Entity } from 'renderer/entity/entity';
import { TableProvider } from 'renderer/components/table/TableContext';
import TableCustom from 'renderer/components/table/TableCustom';

type TableComponentProps<EntityItem, CustomFilters> = {
  entity: Entity<EntityItem, CustomFilters>;
  data?: EntityItem[];
  loading: boolean;
  refetchHandler: () => void;
  actionsHandler: (actionId: string, row: EntityItem) => Promise<void>;
  massActionsHandler: (actionId: string, selectedRows: EntityItem[]) => Promise<void>;
  globalActionsHandler: (actionId: string) => Promise<void>;
};

export default function TableComponent<EntityItem, CustomFilters>({
  entity,
  data,
  loading,
  refetchHandler,
  actionsHandler,
  massActionsHandler,
  globalActionsHandler,
}: TableComponentProps<EntityItem, CustomFilters>) {
  return (
    <TableProvider
      entity={entity}
      data={data}
      loading={loading}
      refetchHandler={refetchHandler}
      actionsHandler={actionsHandler}
      massActionsHandler={massActionsHandler}
      globalActionsHandler={globalActionsHandler}
    >
      <TableCustom />
    </TableProvider>
  );
}
