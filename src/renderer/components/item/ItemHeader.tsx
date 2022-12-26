import { SvgIconComponent } from '@mui/icons-material';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { EnrichedItem, isApplication, isFolder, isInstance } from 'infra/configuration/model/configuration';
import { Avatar, Badge, Box, IconButton, Typography } from '@mui/material';
import { getItemHealthStatusColor, getItemHealthStatusTextId, getItemTypeIcon } from 'renderer/utils/itemUtils';
import { NAVIGATOR_ITEM_HEIGHT } from 'renderer/constants/ui';
import FolderContextMenu from 'renderer/layout/navigator/components/sidebar/tree/menus/FolderContextMenu';
import ApplicationContextMenu from 'renderer/layout/navigator/components/sidebar/tree/menus/ApplicationContextMenu';
import InstanceContextMenu from 'renderer/layout/navigator/components/sidebar/tree/menus/InstanceContextMenu';
import useItemColor from 'renderer/hooks/useItemColor';
import { FormattedMessage } from 'react-intl';

type ItemHeaderProps = { item: EnrichedItem };

export default function ItemHeader({ item }: ItemHeaderProps) {
  const menuAnchorRef = useRef<HTMLButtonElement | null>(null);
  const [menuOpen, setMenuOpen] = useState<boolean>(false);

  const color = useItemColor(item);
  const healthStatusColor = useMemo<string | undefined>(() => getItemHealthStatusColor(item), [item]);
  const healthTextId = useMemo<string | undefined>(() => getItemHealthStatusTextId(item), [item]);
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
          <Badge
            variant={'dot'}
            overlap={'circular'}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            sx={{
              '& .MuiBadge-badge': {
                backgroundColor: healthStatusColor,
              },
            }}
            invisible={!healthStatusColor}
          >
            <Avatar variant={'circular'} sx={{ backgroundColor: color, color: 'white' }}>
              <TypeIcon fontSize={'medium'} />
            </Avatar>
          </Badge>
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
            sx={{
              color: healthStatusColor || 'text.secondary',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
            noWrap
          >
            {healthTextId ? <FormattedMessage id={healthTextId} /> : '\u00A0'}
          </Typography>
        </Box>
      </Box>
    </>
  );
}
