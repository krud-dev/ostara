import React from 'react';
import { BaseUseQueryResult } from 'renderer/apis/requests/base/useBaseQuery';
import { Entity } from 'renderer/entity/entity';
import { TableProvider } from 'renderer/components/table/TableContext';
import TableCustom from 'renderer/components/table/TableCustom';

type TableComponentProps<EntityItem, CustomFilters> = {
  entity: Entity<EntityItem, CustomFilters>;
  queryState: BaseUseQueryResult<EntityItem[]>;
  actionsHandler: (actionId: string, row: EntityItem) => Promise<void>;
  massActionsHandler: (actionId: string, selectedRows: EntityItem[]) => Promise<void>;
  globalActionsHandler: (actionId: string) => Promise<void>;
};

export default function TableComponent<EntityItem, CustomFilters>({
  entity,
  queryState,
  actionsHandler,
  massActionsHandler,
  globalActionsHandler,
}: TableComponentProps<EntityItem, CustomFilters>) {
  return (
    <TableProvider
      entity={entity}
      queryState={queryState}
      actionsHandler={actionsHandler}
      massActionsHandler={massActionsHandler}
      globalActionsHandler={globalActionsHandler}
    >
      <TableCustom />
    </TableProvider>
  );
}
