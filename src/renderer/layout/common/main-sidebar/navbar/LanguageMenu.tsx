import { useCallback } from 'react';
import { Box, IconButton, ListItemIcon, ListItemText, MenuItem } from '@mui/material';
import locales from 'renderer/lang';
import { map } from 'lodash';
import { useUi } from 'renderer/contexts/UiContext';
import MenuPopover from 'renderer/components/menu/popup/MenuPopover';
import { bindMenu, usePopupState } from 'material-ui-popup-state/hooks';

export default function LanguageMenu() {
  const { localeInfo, setLocale, isRtl } = useUi();

  const menuState = usePopupState({ variant: 'popover' });

  const openHandler = useCallback((): void => {
    menuState.open();
  }, [menuState]);

  const changeLocaleHandler = useCallback(
    (locale: string): void => {
      setLocale(locale);
      menuState.close();
    },
    [setLocale, menuState]
  );

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
          ref={menuState.setAnchorEl}
          onClick={openHandler}
          sx={{
            padding: 0,
            width: 36,
            height: 36,
            ...(menuState.isOpen && { bgcolor: 'action.selected' }),
          }}
        >
          <Box
            component="img"
            src={localeInfo.icon}
            alt={localeInfo.name}
            sx={{ width: '24px', borderRadius: '3px' }}
          />
        </IconButton>
      </Box>

      <MenuPopover direction={isRtl ? 'left' : 'right'} {...bindMenu(menuState)}>
        {map(locales, (l) => (
          <MenuItem key={l.id} selected={l.id === localeInfo.id} onClick={() => changeLocaleHandler(l.id)}>
            <ListItemIcon>
              <Box component="img" alt={l.name} src={l.icon} sx={{ width: '28px', borderRadius: '3px' }} />
            </ListItemIcon>

            <ListItemText>{l.name}</ListItemText>
          </MenuItem>
        ))}
      </MenuPopover>
    </>
  );
}
