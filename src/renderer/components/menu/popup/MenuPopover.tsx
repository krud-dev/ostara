import { Menu, PopoverProps } from '@mui/material';
import { useMenuPaperStyle } from 'renderer/components/menu/popup/useMenuPaperStyle';
import { useMemo } from 'react';
import { SxProps } from '@mui/system';
import { Theme } from '@mui/material/styles';

type MenuPopoverProps = {
  direction?: 'left' | 'right';
} & Omit<PopoverProps, 'anchorOrigin' | 'transformOrigin' | 'PaperProps' | 'onClick'>;

export default function MenuPopover({ children, direction = 'left', sx, ...other }: MenuPopoverProps) {
  const paperStyle = useMenuPaperStyle();
  const paperAggregatedStyle = useMemo<SxProps<Theme>>(() => ({ ...paperStyle, ...sx }), [paperStyle, sx]);

  return (
    <Menu
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: direction,
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: direction,
      }}
      PaperProps={{
        sx: {
          mt: 1,
          ...paperAggregatedStyle,
        },
      }}
      onClick={(event) => event.stopPropagation()}
      {...other}
    >
      {children}
    </Menu>
  );
}
