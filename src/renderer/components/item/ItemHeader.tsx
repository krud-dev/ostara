import React, { ReactNode, useCallback, useMemo } from 'react';
import { Avatar, Badge, Box, IconButton, Tooltip, Typography } from '@mui/material';
import {
  getItemDisplayName,
  getItemHealthStatusColor,
  getItemHealthStatusTextId,
  getItemNameTooltip,
} from 'renderer/utils/itemUtils';
import { COMPONENTS_SPACING, EMPTY_STRING, SIDEBAR_HEADER_HEIGHT } from 'renderer/constants/ui';
import useItemColor from 'renderer/hooks/useItemColor';
import { FormattedMessage } from 'react-intl';
import { usePopupState } from 'material-ui-popup-state/hooks';
import { IconViewer } from 'renderer/components/common/IconViewer';
import useItemIcon from 'renderer/hooks/useItemIcon';
import ItemMenu from 'renderer/layout/navigator/components/sidebar/tree/menus/ItemMenu';
import { ItemRO } from '../../definitions/daemon';

type ItemHeaderProps = { item: ItemRO };

export default function ItemHeader({ item }: ItemHeaderProps) {
  const menuState = usePopupState({ variant: 'popover' });

  const color = useItemColor(item);
  const displayName = useMemo<string>(() => getItemDisplayName(item), [item]);
  const displayNameTooltip = useMemo<ReactNode | undefined>(() => getItemNameTooltip(item), [item]);
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
      <ItemMenu item={item} menuState={menuState} />

      <Box sx={{ height: SIDEBAR_HEADER_HEIGHT, px: COMPONENTS_SPACING, display: 'flex', alignItems: 'center' }}>
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
          <Tooltip title={displayNameTooltip}>
            <Typography
              variant="subtitle2"
              sx={{ color: 'text.primary', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
              noWrap
            >
              {displayName || EMPTY_STRING}
            </Typography>
          </Tooltip>

          <Typography variant="body2" sx={{ color: healthStatusColor || 'text.secondary' }} noWrap>
            {healthTextId ? <FormattedMessage id={healthTextId} /> : EMPTY_STRING}
          </Typography>
        </Box>
      </Box>
    </>
  );
}
