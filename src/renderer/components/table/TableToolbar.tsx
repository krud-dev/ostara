import { Stack } from '@mui/material';
import { useTable } from 'renderer/components/table/TableContext';
import SearchToolbar from '../common/SearchToolbar';
import { useMemo } from 'react';
import ToolbarButton from '../common/ToolbarButton';

type TableToolbarProps = {};

export default function TableToolbar({}: TableToolbarProps) {
  const {
    entity,
    refreshHandler,
    filter,
    changeFilterHandler,
    changeCustomFiltersHandler,
    hasGlobalActions,
    globalActionsHandler,
  } = useTable();

  return (
    <SearchToolbar filter={filter} onFilterChange={changeFilterHandler}>
      {entity.CustomFiltersComponent && <entity.CustomFiltersComponent onChange={changeCustomFiltersHandler} />}
      <Stack direction={'row'} alignItems={'center'}>
        {hasGlobalActions &&
          entity.globalActions.map((action) => (
            <ToolbarButton
              tooltipLabelId={action.labelId}
              icon={action.icon}
              onClick={() => globalActionsHandler(action.id)}
              key={action.id}
            />
          ))}

        <ToolbarButton tooltipLabelId={'refresh'} icon={'RefreshOutlined'} onClick={refreshHandler} />
      </Stack>
    </SearchToolbar>
  );
}
