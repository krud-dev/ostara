import { Stack } from '@mui/material';
import { useTable } from 'renderer/components/table/TableContext';
import SearchToolbar from '../common/SearchToolbar';
import { useMemo } from 'react';
import ToolbarButton from '../common/ToolbarButton';

type TableToolbarProps = {};

export default function TableToolbar({}: TableToolbarProps) {
  const {
    entity,
    filter,
    changeFilterHandler,
    changeCustomFiltersHandler,
    hasGlobalActions,
    globalActionsHandler,
    closeAllRowsHandler,
  } = useTable();

  const hasRowDetails = useMemo<boolean>(() => entity.rowAction?.type === 'Details', [entity]);
  const hasActions = useMemo<boolean>(() => hasGlobalActions || hasRowDetails, [hasGlobalActions, hasRowDetails]);

  return (
    <SearchToolbar filter={filter} onFilterChange={changeFilterHandler}>
      {entity.CustomFiltersComponent && <entity.CustomFiltersComponent onChange={changeCustomFiltersHandler} />}
      {hasActions && (
        <Stack direction={'row'} alignItems={'center'}>
          {hasRowDetails && (
            <ToolbarButton
              tooltipLabelId={'collapseAll'}
              icon={'UnfoldLessDoubleOutlined'}
              onClick={closeAllRowsHandler}
            />
          )}

          {hasGlobalActions &&
            entity.globalActions.map((action) => (
              <ToolbarButton
                tooltipLabelId={action.labelId}
                icon={action.icon}
                onClick={() => globalActionsHandler(action.id)}
                key={action.id}
              />
            ))}
        </Stack>
      )}
    </SearchToolbar>
  );
}
