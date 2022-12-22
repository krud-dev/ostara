import { useCallback, useRef, useState } from 'react';
import { Box, IconButton, ListItemIcon, ListItemText, MenuItem } from '@mui/material';
import { useUi } from 'renderer/contexts/UiContext';
import MenuPopover from 'renderer/components/menu/MenuPopover';
import { DarkModeOutlined, LightModeOutlined } from '@mui/icons-material';
import { FormattedMessage } from 'react-intl';
import MAvatar from 'renderer/components/menu/MAvatar';

export default function AccountMenu() {
  const { darkMode, toggleDarkMode } = useUi();

  const anchorRef = useRef<HTMLButtonElement | null>(null);
  const [open, setOpen] = useState<boolean>(false);

  const openHandler = useCallback((): void => {
    setOpen(true);
  }, [setOpen]);

  const closeHandler = useCallback((): void => {
    setOpen(false);
  }, [setOpen]);

  const toggleDarkModeHandler = useCallback((): void => {
    toggleDarkMode();
    closeHandler();
  }, [toggleDarkMode, closeHandler]);

  return (
    <>
      <Box
        sx={{
          flexGrow: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <IconButton
          ref={anchorRef}
          onClick={openHandler}
          sx={{
            padding: 0,
            width: 48,
            height: 48,
            ...(open && { bgcolor: 'action.selected' }),
          }}
        >
          <MAvatar variant={'circular'} color={'primary'}>
            {'SB'}
          </MAvatar>
        </IconButton>
      </Box>

      <MenuPopover open={open} onClose={closeHandler} direction={'right'} anchorEl={anchorRef.current}>
        <MenuItem onClick={toggleDarkModeHandler}>
          <ListItemIcon>
            {darkMode ? <LightModeOutlined fontSize="small" /> : <DarkModeOutlined fontSize="small" />}
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id={darkMode ? 'lightMode' : 'darkMode'} />
          </ListItemText>
        </MenuItem>
      </MenuPopover>
    </>
  );
}
