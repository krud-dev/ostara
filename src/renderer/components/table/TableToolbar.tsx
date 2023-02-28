import { Box, IconButton, Stack, Tooltip } from '@mui/material';
import { useTable } from 'renderer/components/table/TableContext';
import { FormattedMessage } from 'react-intl';
import { IconViewer, MUIconType } from 'renderer/components/common/IconViewer';
import SearchToolbar from '../common/SearchToolbar';
import { useMemo } from 'react';

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
            <TableToolbarAction
              tooltipLabelId={'collapseAll'}
              icon={'UnfoldLessDoubleOutlined'}
              onClick={closeAllRowsHandler}
            />
          )}

          {hasGlobalActions &&
            entity.globalActions.map((action) => (
              <TableToolbarAction
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

type TableToolbarActionProps = {
  tooltipLabelId: string;
  icon: MUIconType;
  onClick: () => void;
};

function TableToolbarAction({ tooltipLabelId, icon, onClick }: TableToolbarActionProps) {
  return (
    <Box>
      <Tooltip title={<FormattedMessage id={tooltipLabelId} />}>
        <IconButton onClick={onClick}>
          <IconViewer icon={icon} fontSize={'small'} />
        </IconButton>
      </Tooltip>
    </Box>
  );
}
