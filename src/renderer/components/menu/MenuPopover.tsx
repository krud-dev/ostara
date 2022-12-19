import { Popover, PopoverProps } from '@mui/material';

export default function MenuPopover({ children, sx, ...other }: PopoverProps) {
  return (
    <Popover
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'left',
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
