import { useCallback, useRef, useState } from 'react';
import {
  Box,
  IconButton,
  ListItemIcon,
  ListItemText,
  MenuItem,
} from '@mui/material';
import locales from '../../../lang';
import { map } from 'lodash';
import { useUi } from 'renderer/contexts/UiContext';
import MenuPopover from 'renderer/components/menu/MenuPopover';

export default function LanguagePopover() {
  const { localeInfo, setLocale } = useUi();

  const anchorRef = useRef<HTMLButtonElement | null>(null);
  const [open, setOpen] = useState<boolean>(false);

  const handleChangeLocale = useCallback(
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
            width: 44,
            height: 44,
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

      <MenuPopover
        open={open}
        onClose={() => setOpen(false)}
        anchorEl={anchorRef.current}
      >
        <Box sx={{ py: 1 }}>
          {map(locales, (l) => (
            <MenuItem
              key={l.id}
              selected={l.id === localeInfo.id}
              onClick={() => {
                handleChangeLocale(l.id);
                setOpen(false);
              }}
              sx={{ py: 1, px: 2.5 }}
            >
              <ListItemIcon>
                <Box
                  component="img"
                  alt={l.name}
                  src={l.icon}
                  sx={{ width: '28px', borderRadius: '3px' }}
                />
              </ListItemIcon>

              <ListItemText primaryTypographyProps={{ variant: 'body2' }}>
                {l.name}
              </ListItemText>
            </MenuItem>
          ))}
        </Box>
      </MenuPopover>
    </>
  );
}
