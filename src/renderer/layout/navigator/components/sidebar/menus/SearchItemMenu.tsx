import { useCallback } from 'react';
import { IconButton } from '@mui/material';
import MenuPopover from 'renderer/components/menu/popup/MenuPopover';
import { MoreVertOutlined, UnfoldLessDoubleOutlined, UnfoldMoreDoubleOutlined } from '@mui/icons-material';
import { FormattedMessage } from 'react-intl';
import { useNavigatorTree } from 'renderer/contexts/NavigatorTreeContext';
import { bindMenu, usePopupState } from 'material-ui-popup-state/hooks';
import CustomMenuItem from 'renderer/components/menu/item/CustomMenuItem';

export default function SearchItemMenu() {
  const { performAction } = useNavigatorTree();

  const menuState = usePopupState({ variant: 'popover' });

  const openHandler = useCallback((): void => {
    menuState.open();
  }, [menuState]);

  const collapseAllHandler = useCallback((): void => {
    performAction('collapseAll');
    menuState.close();
  }, [performAction, menuState]);

  const expandAllHandler = useCallback((): void => {
    performAction('expandAll');
    menuState.close();
  }, [performAction, menuState]);

  return (
    <>
      <IconButton size={'small'} ref={menuState.setAnchorEl} onClick={openHandler}>
        <MoreVertOutlined fontSize={'medium'} />
      </IconButton>

      <MenuPopover {...bindMenu(menuState)}>
        <CustomMenuItem
          icon={'UnfoldLessDoubleOutlined'}
          text={<FormattedMessage id={'collapseAll'} />}
          onClick={collapseAllHandler}
        />
        <CustomMenuItem
          icon={'UnfoldMoreDoubleOutlined'}
          text={<FormattedMessage id={'expandAll'} />}
          onClick={expandAllHandler}
        />
      </MenuPopover>
    </>
  );
}
