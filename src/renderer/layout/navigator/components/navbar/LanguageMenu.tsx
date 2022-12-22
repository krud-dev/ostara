import { useCallback, useRef, useState } from 'react';
import { Box, IconButton, ListItemIcon, ListItemText, MenuItem } from '@mui/material';
import locales from 'renderer/lang';
import { map } from 'lodash';
import { useUi } from 'renderer/contexts/UiContext';
import MenuPopover from 'renderer/components/menu/MenuPopover';

export default function LanguageMenu() {
  const { localeInfo, setLocale } = useUi();

  const anchorRef = useRef<HTMLButtonElement | null>(null);
  const [open, setOpen] = useState<boolean>(false);

  const changeLocaleHandler = useCallback(
    (locale: string): void => {
      setLocale(locale);
    },
    [setLocale]
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
          ref={anchorRef}
          onClick={() => setOpen(true)}
          sx={{
            padding: 0,
            width: 48,
            height: 48,
            ...(open && { bgcolor: 'action.selected' }),
          }}
        >
          <Box
            component="img"
            src={localeInfo.icon}
            alt={localeInfo.name}
            sx={{ width: '28px', borderRadius: '3px' }}
          />
        </IconButton>
      </Box>

      <MenuPopover open={open} onClose={() => setOpen(false)} anchorEl={anchorRef.current}>
        {map(locales, (l) => (
          <MenuItem
            key={l.id}
            selected={l.id === localeInfo.id}
            onClick={() => {
              changeLocaleHandler(l.id);
              setOpen(false);
            }}
          >
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
