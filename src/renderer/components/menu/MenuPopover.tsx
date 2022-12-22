import { Popover, PopoverProps } from '@mui/material';

type MenuPopoverProps = {
  direction?: 'left' | 'right';
} & PopoverProps;

export default function MenuPopover({ children, direction = 'left', sx, ...other }: MenuPopoverProps) {
  return (
    <Popover
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
          py: 1,
          overflow: 'inherit',
          boxShadow: (theme) => theme.customShadows.z20,
          border: (theme) => `solid 1px ${theme.palette.grey[500_8]}`,
          minWidth: 200,
          ...sx,
        },
      }}
      {...other}
    >
      {children}
    </Popover>
  );
}
