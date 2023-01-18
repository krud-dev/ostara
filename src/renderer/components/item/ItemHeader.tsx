import React, { useCallback, useMemo } from 'react';
import { EnrichedItem } from 'infra/configuration/model/configuration';
import { Avatar, Badge, Box, IconButton, Tooltip, Typography } from '@mui/material';
import { getItemHealthStatusColor, getItemHealthStatusTextId, getItemNameTooltip } from 'renderer/utils/itemUtils';
import { COMPONENTS_SPACING, NAVIGATOR_ITEM_HEIGHT } from 'renderer/constants/ui';
import useItemColor from 'renderer/hooks/useItemColor';
import { FormattedMessage } from 'react-intl';
import { usePopupState } from 'material-ui-popup-state/hooks';
import { IconViewer } from 'renderer/components/common/IconViewer';
import useItemIcon from 'renderer/hooks/useItemIcon';
import ItemMenu from 'renderer/layout/navigator/components/sidebar/tree/menus/ItemMenu';

type ItemHeaderProps = { item: EnrichedItem };

export default function ItemHeader({ item }: ItemHeaderProps) {
  const menuState = usePopupState({ variant: 'popover' });

  const color = useItemColor(item);
  const nameTooltip = useMemo<string | undefined>(() => getItemNameTooltip(item), [item]);
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

      <Box sx={{ height: NAVIGATOR_ITEM_HEIGHT * 2, px: COMPONENTS_SPACING, display: 'flex', alignItems: 'center' }}>
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
          <Tooltip title={nameTooltip}>
            <Typography
              variant="subtitle2"
              sx={{ color: 'text.primary', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
              noWrap
            >
              {item.alias}
            </Typography>
          </Tooltip>

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
