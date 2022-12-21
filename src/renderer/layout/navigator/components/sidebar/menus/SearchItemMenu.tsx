import { useCallback, useRef, useState } from 'react';
import { IconButton, ListItemIcon, ListItemText, MenuItem } from '@mui/material';
import MenuPopover from 'renderer/components/menu/MenuPopover';
import { MoreVertOutlined, UnfoldLessDoubleOutlined, UnfoldMoreDoubleOutlined } from '@mui/icons-material';
import { FormattedMessage } from 'react-intl';
import { useNavigatorTree } from 'renderer/contexts/NavigatorTreeContext';

export default function SearchItemMenu() {
  const { performAction } = useNavigatorTree();

  const anchorRef = useRef<HTMLButtonElement | null>(null);
  const [open, setOpen] = useState<boolean>(false);

  const openHandler = useCallback(() => {
    setOpen(true);
  }, [setOpen]);

  const closeHandler = useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  const collapseAllHandler = useCallback((): void => {
    performAction('collapseAll');
    closeHandler();
  }, [performAction, closeHandler]);

  const expandAllHandler = useCallback((): void => {
    performAction('expandAll');
    closeHandler();
  }, [performAction, closeHandler]);

  return (
    <>
      <IconButton size={'small'} ref={anchorRef} onClick={openHandler}>
        <MoreVertOutlined fontSize={'small'} />
      </IconButton>

      <MenuPopover open={open} onClose={closeHandler} anchorEl={anchorRef.current}>
        <MenuItem onClick={collapseAllHandler}>
          <ListItemIcon>
            <UnfoldLessDoubleOutlined fontSize="small" />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id={'collapseAll'} />
          </ListItemText>
        </MenuItem>
        <MenuItem onClick={expandAllHandler}>
          <ListItemIcon>
            <UnfoldMoreDoubleOutlined fontSize="small" />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id={'expandAll'} />
          </ListItemText>
        </MenuItem>
      </MenuPopover>
    </>
  );
}
