import { SvgIconComponent } from '@mui/icons-material';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { EnrichedItem, isApplication, isFolder, isInstance } from 'infra/configuration/model/configuration';
import { Avatar, Box, IconButton, Typography } from '@mui/material';
import { getItemTypeIcon } from 'renderer/utils/itemUtils';
import { NAVIGATOR_ITEM_HEIGHT } from 'renderer/constants/ui';
import FolderContextMenu from 'renderer/layout/navigator/components/sidebar/tree/menus/FolderContextMenu';
import ApplicationContextMenu from 'renderer/layout/navigator/components/sidebar/tree/menus/ApplicationContextMenu';
import InstanceContextMenu from 'renderer/layout/navigator/components/sidebar/tree/menus/InstanceContextMenu';
import useItemColor from 'renderer/hooks/useItemColor';

type ItemHeaderProps = { item: EnrichedItem };

export default function ItemHeader({ item }: ItemHeaderProps) {
  const menuAnchorRef = useRef<HTMLButtonElement | null>(null);
  const [menuOpen, setMenuOpen] = useState<boolean>(false);

  const color = useItemColor(item);
  const TypeIcon = useMemo<SvgIconComponent>(() => getItemTypeIcon(item.type), [item]);

  const openMenuHandler = useCallback(
    (event: React.MouseEvent): void => {
      event.preventDefault();
      setMenuOpen(true);
    },
    [setMenuOpen]
  );

  const closeMenuHandler = useCallback((): void => {
    setMenuOpen(false);
  }, [setMenuOpen]);

  return (
    <>
      {isFolder(item) && (
        <FolderContextMenu
          item={item}
          open={menuOpen}
          anchorEl={menuAnchorRef.current}
          onClose={closeMenuHandler}
          sx={{ mt: 0.5 }}
        />
      )}
      {isApplication(item) && (
        <ApplicationContextMenu
          item={item}
          open={menuOpen}
          anchorEl={menuAnchorRef.current}
          onClose={closeMenuHandler}
          sx={{ mt: 0.5 }}
        />
      )}
      {isInstance(item) && (
        <InstanceContextMenu
          item={item}
          open={menuOpen}
          anchorEl={menuAnchorRef.current}
          onClose={closeMenuHandler}
          sx={{ mt: 0.5 }}
        />
      )}

      <Box sx={{ height: NAVIGATOR_ITEM_HEIGHT * 2, px: 2.5, display: 'flex', alignItems: 'center' }}>
        <IconButton
          size={'small'}
          sx={{ p: 0 }}
          ref={menuAnchorRef}
          onClick={openMenuHandler}
          onContextMenu={openMenuHandler}
        >
          <Avatar variant={'circular'} sx={{ backgroundColor: color, color: 'white' }}>
            <TypeIcon fontSize={'medium'} />
          </Avatar>
        </IconButton>
        <Box sx={{ ml: 2, overflow: 'hidden' }}>
          <Typography
            variant="subtitle2"
            sx={{ color: 'text.primary', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
            noWrap
          >
            {item.alias}
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: 'success.main', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
            noWrap
          >
            {'Healthy'}
          </Typography>
        </Box>
      </Box>
    </>
  );
}
