import { SxProps } from '@mui/system';
import { Theme } from '@mui/material/styles';
import { useMemo } from 'react';

export const useMenuPaperStyle = (): SxProps<Theme> => {
  return useMemo<SxProps<Theme>>(
    () => ({
      py: 1,
      overflow: 'inherit',
      boxShadow: (theme) => theme.customShadows.z20,
      border: (theme) => `solid 1px ${theme.palette.grey[500_8]}`,
      minWidth: 200,
    }),
    []
  );
};
