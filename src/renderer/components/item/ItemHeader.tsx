import React, { useCallback, useMemo } from 'react';
import { EnrichedItem, isApplication, isFolder, isInstance } from 'infra/configuration/model/configuration';
import { Avatar, Badge, Box, IconButton, Typography } from '@mui/material';
import { getItemHealthStatusColor, getItemHealthStatusTextId } from 'renderer/utils/itemUtils';
import { NAVIGATOR_ITEM_HEIGHT } from 'renderer/constants/ui';
import FolderContextMenu from 'renderer/layout/navigator/components/sidebar/tree/menus/FolderContextMenu';
import ApplicationContextMenu from 'renderer/layout/navigator/components/sidebar/tree/menus/ApplicationContextMenu';
import InstanceContextMenu from 'renderer/layout/navigator/components/sidebar/tree/menus/InstanceContextMenu';
import useItemColor from 'renderer/hooks/useItemColor';
import { FormattedMessage } from 'react-intl';
import { bindMenu, usePopupState } from 'material-ui-popup-state/hooks';
import { IconViewer } from 'renderer/components/icon/IconViewer';
import useItemIcon from 'renderer/hooks/useItemIcon';

type ItemHeaderProps = { item: EnrichedItem };

export default function ItemHeader({ item }: ItemHeaderProps) {
  const menuState = usePopupState({ variant: 'popper' });

  const color = useItemColor(item);
  const healthStatusColor = useMemo<string | undefined>(() => getItemHealthStatusColor(item), [item]);
  const healthTextId = useMemo<string | undefined>(() => getItemHealthStatusTextId(item), [item]);
  const itemIcon = useItemIcon(item);

  const openMenuHandler = useCallback(
    (event: React.MouseEvent): void => {
      event.preventDefault();
      menuState.open();
    },
    [menuState]
  );

  return (
    <>
      {isFolder(item) && (
        <FolderContextMenu item={item} placement={'bottom-start'} sx={{ mt: 0.5 }} {...bindMenu(menuState)} />
      )}
      {isApplication(item) && (
        <ApplicationContextMenu item={item} placement={'bottom-start'} sx={{ mt: 0.5 }} {...bindMenu(menuState)} />
      )}
      {isInstance(item) && (
        <InstanceContextMenu item={item} placement={'bottom-start'} sx={{ mt: 0.5 }} {...bindMenu(menuState)} />
      )}

      <Box sx={{ height: NAVIGATOR_ITEM_HEIGHT * 2, px: 2.5, display: 'flex', alignItems: 'center' }}>
        <IconButton
          size={'small'}
          sx={{ p: 0 }}
          ref={menuState.setAnchorEl}
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
              <IconViewer icon={itemIcon} fontSize={'medium'} />
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
