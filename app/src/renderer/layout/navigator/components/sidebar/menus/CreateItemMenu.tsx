import { useCallback } from 'react';
import { IconButton } from '@mui/material';
import MenuPopover from 'renderer/components/menu/popup/MenuPopover';
import { AddOutlined } from '@mui/icons-material';
import { bindMenu, usePopupState } from 'material-ui-popup-state/hooks';
import CreateItemMenuItems from 'renderer/layout/navigator/components/sidebar/menus/CreateItemMenuItems';
import { useNavigatorLayout } from 'renderer/contexts/NavigatorLayoutContext';

export default function CreateItemMenu() {
  const { data } = useNavigatorLayout();

  const menuState = usePopupState({ variant: 'popover' });

  const openHandler = useCallback((): void => {
    if (!data) {
      return;
    }
    menuState.open();
  }, [data, menuState]);

  return (
    <>
      <IconButton size={'small'} ref={menuState.setAnchorEl} onClick={openHandler}>
        <AddOutlined fontSize={'medium'} />
      </IconButton>

      <MenuPopover {...bindMenu(menuState)}>
        <CreateItemMenuItems menuState={menuState} />
      </MenuPopover>
    </>
  );
}
