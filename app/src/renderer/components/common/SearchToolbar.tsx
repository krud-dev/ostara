import { Stack } from '@mui/material';
import SearchTextField from 'renderer/components/input/SearchTextField';
import { COMPONENTS_SPACING } from 'renderer/constants/ui';
import { PropsWithChildren } from 'react';
import { SxProps } from '@mui/system';
import { Theme } from '@mui/material/styles';

type SearchToolbarProps = {
  filter?: string;
  onFilterChange: (filter: string) => void;
  sx?: SxProps<Theme>;
} & PropsWithChildren<any>;

export default function SearchToolbar({ filter, onFilterChange, sx, children }: SearchToolbarProps) {
  return (
    <Stack spacing={1} direction={{ xs: 'column', sm: 'row' }} sx={{ p: COMPONENTS_SPACING, ...sx }}>
      <SearchTextField value={filter} onChangeValue={onFilterChange} size={'small'} />
      {children}
    </Stack>
  );
}
