import { ClickAwayListener, Paper, Popper, PopperProps } from '@mui/material';
import { PropsWithChildren } from 'react';

type ContextMenuPopperProps = PopperProps &
  PropsWithChildren<any> & {
    id?: string;
    onClose?: () => void;
  };

export default function ContextMenuPopper({
  id = 'context-menu-popper',
  onClose,
  children,
  sx,
  ...other
}: ContextMenuPopperProps) {
  const clickAwayHandler = (event: MouseEvent | TouchEvent) => {
    onClose?.();
  };

  return (
    <Popper id={id} placement={'bottom-start'} disablePortal={false} sx={{ zIndex: 10000 }} {...other}>
      <ClickAwayListener onClickAway={clickAwayHandler} mouseEvent={'onMouseDown'}>
        <Paper
          sx={{
            py: 1,
            overflow: 'inherit',
            boxShadow: (theme) => theme.customShadows.z20,
            border: (theme) => `solid 1px ${theme.palette.grey[500_8]}`,
            minWidth: 200,
            ...sx,
          }}
        >
          {children}
        </Paper>
      </ClickAwayListener>
    </Popper>
  );
}
