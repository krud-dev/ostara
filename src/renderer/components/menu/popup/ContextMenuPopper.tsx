import { ClickAwayListener, Paper, Popper, PopperProps } from '@mui/material';
import { PropsWithChildren, RefObject, useCallback, useEffect } from 'react';
import { useMenuPaperStyle } from 'renderer/components/menu/popup/useMenuPaperStyle';
import { usePopupState } from 'material-ui-popup-state/hooks';
import { ContextMenuProvider } from 'renderer/components/menu/popup/ContextMenuContext';

export type ContextMenuPopperProps = Omit<
  PopperProps,
  'disablePortal' | 'popperOptions' | 'open' | 'anchorEl' | 'placement'
> &
  PropsWithChildren<any> & {
    id?: string;
    contextMenuRef?: RefObject<HTMLElement>;
    disabled?: boolean;
    onContextMenuChange?: (open: boolean) => void;
  };

export default function ContextMenuPopper({
  id = 'context-menu-popper',
  contextMenuRef,
  disabled,
  onContextMenuChange,
  children,
  sx,
  ...other
}: ContextMenuPopperProps) {
  const menuState = usePopupState({ variant: 'popper' });

  const contextMenuHandler = useCallback((event: MouseEvent): void => {
    event.preventDefault();
    event.stopPropagation();

    const virtualElement: any = {
      getBoundingClientRect: () => ({
        width: 0,
        height: 0,
        top: event.clientY,
        right: event.clientX,
        bottom: event.clientY,
        left: event.clientX,
      }),
    };
    menuState.setAnchorEl(virtualElement);
    menuState.open();

    onContextMenuChange?.(true);
  }, []);

  useEffect(() => {
    if (!disabled) {
      contextMenuRef?.current?.addEventListener('contextmenu', contextMenuHandler);
    }
    return () => {
      contextMenuRef?.current?.removeEventListener('contextmenu', contextMenuHandler);
    };
  }, [disabled]);

  const clickAwayHandler = useCallback(
    (event: MouseEvent | TouchEvent): void => {
      menuState.close();
      onContextMenuChange?.(false);
    },
    [menuState]
  );

  const paperStyle = useMenuPaperStyle();

  return (
    <ContextMenuProvider menuState={menuState}>
      <Popper
        id={id}
        open={menuState.isOpen}
        anchorEl={menuState.anchorEl}
        placement={'auto-start'}
        disablePortal={false}
        popperOptions={{ strategy: 'fixed' }}
        sx={{ zIndex: 10000 }}
        {...other}
      >
        <ClickAwayListener onClickAway={clickAwayHandler} mouseEvent={'onPointerDown'}>
          <Paper sx={{ ...paperStyle, ...sx }}>{children}</Paper>
        </ClickAwayListener>
      </Popper>
    </ContextMenuProvider>
  );
}
