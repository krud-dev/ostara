import { ClickAwayListener, Paper, Popper, PopperProps } from '@mui/material';
import { PropsWithChildren, useCallback } from 'react';
import { useMenuPaperStyle } from 'renderer/components/menu/popup/useMenuPaperStyle';

type ContextMenuPopperProps = PopperProps &
  PropsWithChildren<any> & {
    id?: string;
    onClose?: () => void;
  };

export default function ContextMenuPopper({
  id = 'context-menu-popper',
  placement,
  onClose,
  children,
  sx,
  ...other
}: ContextMenuPopperProps) {
  const clickAwayHandler = useCallback(
    (event: MouseEvent | TouchEvent) => {
      onClose?.();
    },
    [onClose]
  );

  const paperStyle = useMenuPaperStyle();

  return (
    <Popper
      id={id}
      placement={placement || 'auto-start'}
      disablePortal={false}
      popperOptions={{ strategy: 'fixed' }}
      sx={{ zIndex: 10000 }}
      {...other}
    >
      <ClickAwayListener onClickAway={clickAwayHandler} mouseEvent={'onMouseDown'}>
        <Paper sx={{ ...paperStyle, ...sx }}>{children}</Paper>
      </ClickAwayListener>
    </Popper>
  );
}
