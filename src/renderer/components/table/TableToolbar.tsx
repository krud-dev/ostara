import { Stack } from '@mui/material';
import SearchTextField from 'renderer/components/input/SearchTextField';
import { COMPONENTS_SPACING } from 'renderer/constants/ui';
import { useTable } from 'renderer/components/table/TableContext';

type TableToolbarProps = {};

export default function TableToolbar({}: TableToolbarProps) {
  const { filter, changeFilterHandler, dense } = useTable();
  return (
    <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }} sx={{ p: COMPONENTS_SPACING }}>
      <SearchTextField value={filter} onChangeValue={changeFilterHandler} size={dense ? 'small' : undefined} />
    </Stack>
  );
}
