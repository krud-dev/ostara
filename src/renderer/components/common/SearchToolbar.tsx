import { Stack } from '@mui/material';
import SearchTextField from 'renderer/components/input/SearchTextField';
import { COMPONENTS_SPACING } from 'renderer/constants/ui';
import { PropsWithChildren } from 'react';

type SearchToolbarProps = {
  filter: string;
  onFilterChange: (filter: string) => void;
} & PropsWithChildren<any>;

export default function SearchToolbar({ filter, onFilterChange, children }: SearchToolbarProps) {
  return (
    <Stack spacing={1} direction={{ xs: 'column', sm: 'row' }} sx={{ p: COMPONENTS_SPACING }}>
      <SearchTextField value={filter} onChangeValue={onFilterChange} size={'small'} />
      {children}
    </Stack>
  );
}
