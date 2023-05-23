import { Stack } from '@mui/material';
import { useTable } from 'renderer/components/table/TableContext';
import SearchToolbar from '../common/SearchToolbar';
import React, { useCallback, useMemo } from 'react';
import ToolbarButton from '../common/ToolbarButton';
import { FormattedMessage } from 'react-intl';
import { useAnalytics } from '../../contexts/AnalyticsContext';

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
  const { track } = useAnalytics();

  const [loadingActionIds, setLoadingActionIds] = React.useState<string[]>([]);

  const globalActionClickHandler = useCallback(
    async (event: React.MouseEvent, actionId: string): Promise<void> => {
      event.stopPropagation();

      setLoadingActionIds((prev) => [...prev, actionId]);

      track({ name: 'table_global_action', properties: { table: entity.id, action: actionId } });
      await globalActionsHandler(actionId);

      setLoadingActionIds((prev) => prev.filter((id) => id !== actionId));
    },
    [globalActionsHandler, setLoadingActionIds]
  );

  return (
    <SearchToolbar filter={filter} onFilterChange={changeFilterHandler}>
      {entity.CustomFiltersComponent && <entity.CustomFiltersComponent onChange={changeCustomFiltersHandler} />}
      <Stack direction={'row'} alignItems={'center'}>
        {hasGlobalActions &&
          entity.globalActions.map((action) => {
            const disabled = loadingActionIds.includes(action.id);
            return (
              <ToolbarButton
                tooltip={<FormattedMessage id={action.labelId} />}
                icon={action.icon}
                disabled={disabled}
                onClick={(event) => globalActionClickHandler(event, action.id)}
                key={action.id}
              />
            );
          })}

        <ToolbarButton
          tooltip={<FormattedMessage id={'refresh'} />}
          icon={'RefreshOutlined'}
          onClick={refreshHandler}
        />
      </Stack>
    </SearchToolbar>
  );
}
