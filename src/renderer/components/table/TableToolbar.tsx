import { Box, IconButton, Stack, Tooltip } from '@mui/material';
import { useTable } from 'renderer/components/table/TableContext';
import { FormattedMessage } from 'react-intl';
import { IconViewer } from 'renderer/components/common/IconViewer';
import SearchToolbar from '../common/SearchToolbar';

type TableToolbarProps = {};

export default function TableToolbar({}: TableToolbarProps) {
  const { entity, filter, changeFilterHandler, changeCustomFiltersHandler, hasGlobalActions, globalActionsHandler } =
    useTable();
  return (
    <SearchToolbar filter={filter} onFilterChange={changeFilterHandler}>
      {entity.CustomFiltersComponent && <entity.CustomFiltersComponent onChange={changeCustomFiltersHandler} />}
      {hasGlobalActions && (
        <Stack direction={'row'} alignItems={'center'}>
          {entity.globalActions.map((action) => (
            <Box key={action.id}>
              <Tooltip title={<FormattedMessage id={action.labelId} />}>
                <IconButton onClick={() => globalActionsHandler(action.id)}>
                  <IconViewer icon={action.icon} fontSize={'small'} />
                </IconButton>
              </Tooltip>
            </Box>
          ))}
        </Stack>
      )}
    </SearchToolbar>
  );
}
