import { Box, IconButton, Stack, Tooltip } from '@mui/material';
import SearchTextField from 'renderer/components/input/SearchTextField';
import { COMPONENTS_SPACING } from 'renderer/constants/ui';
import { useTable } from 'renderer/components/table/TableContext';
import { FormattedMessage } from 'react-intl';
import { IconViewer } from 'renderer/components/common/IconViewer';

type TableToolbarProps = {};

export default function TableToolbar({}: TableToolbarProps) {
  const { entity, filter, changeFilterHandler, changeCustomFiltersHandler, hasGlobalActions, globalActionsHandler } =
    useTable();
  return (
    <Stack spacing={1} direction={{ xs: 'column', sm: 'row' }} sx={{ p: COMPONENTS_SPACING }}>
      <SearchTextField value={filter} onChangeValue={changeFilterHandler} size={'small'} />
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
    </Stack>
  );
}
