import { useCallback, useRef, useState } from 'react';
import {
  IconButton,
  ListItemIcon,
  ListItemText,
  MenuItem,
} from '@mui/material';
import MenuPopover from 'renderer/components/menu/MenuPopover';
import { FolderOutlined, MoreVertOutlined } from '@mui/icons-material';
import { FormattedMessage } from 'react-intl';

export default function SearchItemMenu() {
  const anchorRef = useRef<HTMLButtonElement | null>(null);
  const [open, setOpen] = useState<boolean>(false);

  const createItemHandler = useCallback((): void => {}, []);

  return (
    <>
      <IconButton size={'small'} ref={anchorRef} onClick={() => setOpen(true)}>
        <MoreVertOutlined fontSize={'small'} />
      </IconButton>

      <MenuPopover
        open={open}
        onClose={() => setOpen(false)}
        anchorEl={anchorRef.current}
      >
        <MenuItem onClick={createItemHandler}>
          <ListItemIcon>
            <FolderOutlined fontSize="small" />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id={'createFolder'} />
          </ListItemText>
        </MenuItem>
      </MenuPopover>
    </>
  );
}
