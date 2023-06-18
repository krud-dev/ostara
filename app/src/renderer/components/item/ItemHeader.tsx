import React, { ReactNode, useCallback, useMemo } from 'react';
import { Avatar, Badge, Box, IconButton, Tooltip, Typography } from '@mui/material';
import {
  getItemDisplayName,
  getItemHealthStatusColor,
  getItemHealthStatusComponent,
  getItemHealthStatusTextId,
  getItemNameTooltip,
  getItemVersion,
  getItemVersionTooltip,
} from 'renderer/utils/itemUtils';
import { COMPONENTS_SPACING, EMPTY_STRING, SIDEBAR_HEADER_HEIGHT } from 'renderer/constants/ui';
import useItemColor from 'renderer/hooks/useItemColor';
import { FormattedMessage } from 'react-intl';
import { usePopupState } from 'material-ui-popup-state/hooks';
import { IconViewer } from 'renderer/components/common/IconViewer';
import useItemIcon from 'renderer/hooks/useItemIcon';
import ItemMenu from 'renderer/layout/navigator/components/sidebar/tree/menus/ItemMenu';
import { ItemRO } from '../../definitions/daemon';
import { useNavigatorLayout } from 'renderer/contexts/NavigatorLayoutContext';

type ItemHeaderProps = { item: ItemRO };

export default function ItemHeader({ item }: ItemHeaderProps) {
  const menuState = usePopupState({ variant: 'popover' });
  const { data } = useNavigatorLayout();

  const color = useItemColor(item, data);
  const displayName = useMemo<string>(() => getItemDisplayName(item), [item]);
  const displayNameTooltip = useMemo<ReactNode | undefined>(() => getItemNameTooltip(item), [item]);
  const healthStatusColor = useMemo<string | undefined>(() => getItemHealthStatusColor(item), [item]);
  const healthStatusComponent = useMemo<ReactNode | undefined>(() => getItemHealthStatusComponent(item), [item]);
  const healthTextId = useMemo<string | undefined>(() => getItemHealthStatusTextId(item), [item]);
  const itemIcon = useItemIcon(item);
  const version = useMemo<string | undefined>(() => getItemVersion(item), [item]);
  const versionTooltip = useMemo<ReactNode | undefined>(() => getItemVersionTooltip(item), [item]);

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
            variant={healthStatusComponent ? 'standard' : 'dot'}
            overlap={'circular'}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            sx={{
              '& .MuiBadge-badge': {
                width: 10,
                minWidth: 0,
                height: 10,
                p: 0,
                backgroundColor: healthStatusColor,
              },
            }}
            invisible={!healthStatusColor}
            badgeContent={healthStatusComponent}
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

          <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
            <Typography variant="inherit" component={'span'} sx={{ color: healthStatusColor }}>
              {healthTextId ? <FormattedMessage id={healthTextId} /> : EMPTY_STRING}
            </Typography>
            {version && (
              <Tooltip title={versionTooltip}>
                <Typography variant={'caption'} component={'span'}>
                  {` (${version})`}
                </Typography>
              </Tooltip>
            )}
          </Typography>
        </Box>
      </Box>
    </>
  );
}
