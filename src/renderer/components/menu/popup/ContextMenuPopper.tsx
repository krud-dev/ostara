import { ClickAwayListener, Paper, Popper, PopperProps } from '@mui/material';
import { PropsWithChildren, RefObject, useCallback, useEffect, useState } from 'react';
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
    clickRef?: RefObject<HTMLElement>;
    disabled?: boolean;
    onContextMenuChange?: (open: boolean) => void;
    onClickChange?: (open: boolean) => void;
  };

export default function ContextMenuPopper({
  id = 'context-menu-popper',
  contextMenuRef,
  clickRef,
  disabled,
  onContextMenuChange,
  onClickChange,
  children,
  sx,
  ...other
}: ContextMenuPopperProps) {
  const menuState = usePopupState({ variant: 'popper' });

  const [mode, setMode] = useState<'click' | 'contextmenu'>('click');

  const contextMenuHandler = useCallback((event: MouseEvent): void => {
    event.preventDefault();
    event.stopPropagation();

    setMode('contextmenu');

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

  const clickHandler = useCallback((event: MouseEvent): void => {
    event.preventDefault();
    event.stopPropagation();

    setMode('click');

    const boundingRect = clickRef?.current?.getBoundingClientRect();
    const virtualElement: any = {
      getBoundingClientRect: () => boundingRect,
    };

    menuState.setAnchorEl(virtualElement);
    menuState.open();

    onClickChange?.(true);
  }, []);

  useEffect(() => {
    if (!disabled) {
      contextMenuRef?.current?.addEventListener('contextmenu', contextMenuHandler);
      clickRef?.current?.addEventListener('click', clickHandler);
    }

    return () => {
      contextMenuRef?.current?.removeEventListener('contextmenu', contextMenuHandler);
      clickRef?.current?.removeEventListener('click', clickHandler);
    };
  }, [disabled]);

  const clickAwayHandler = useCallback(
    (event: MouseEvent | TouchEvent): void => {
      menuState.close();
      if (mode === 'click') {
        onClickChange?.(false);
      } else {
        onContextMenuChange?.(false);
      }
    },
    [menuState, mode]
  );

  const paperStyle = useMenuPaperStyle();

  return (
    <ContextMenuProvider menuState={menuState}>
      <Popper
        id={id}
        open={menuState.isOpen}
        anchorEl={menuState.anchorEl}
        placement={mode === 'click' ? 'bottom-start' : 'auto-start'}
        disablePortal={false}
        popperOptions={{ strategy: 'fixed' }}
        sx={{ zIndex: 10000 }}
        {...other}
      >
        <ClickAwayListener onClickAway={clickAwayHandler} mouseEvent={'onMouseDown'}>
          <Paper sx={{ ...paperStyle, ...(mode === 'click' ? { mt: 0.5 } : {}), ...sx }}>{children}</Paper>
        </ClickAwayListener>
      </Popper>
    </ContextMenuProvider>
  );
}
