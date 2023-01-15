import { NodeRendererProps } from 'react-arborist';
import { Badge, IconButton, ListItem, ListItemIcon, ListItemText, TextField, Tooltip } from '@mui/material';
import { alpha, experimentalStyled as styled, Theme, useTheme } from '@mui/material/styles';
import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { TreeItem } from 'renderer/layout/navigator/components/sidebar/tree/tree';
import typography from 'renderer/theme/config/typography';
import { KeyboardArrowDown, KeyboardArrowRight, MoreVert, SvgIconComponent } from '@mui/icons-material';
import { NAVIGATOR_ITEM_HEIGHT } from 'renderer/constants/ui';
import { getItemHealthStatusColor, getItemNameTooltip, getItemUrl } from 'renderer/utils/itemUtils';
import { isApplication, isFolder, Item } from 'infra/configuration/model/configuration';
import { SxProps } from '@mui/system';
import { matchPath, useLocation, useNavigate } from 'react-router-dom';
import useItemColor from 'renderer/hooks/useItemColor';
import { IconViewer } from 'renderer/components/icon/IconViewer';
import useItemIcon from 'renderer/hooks/useItemIcon';
import ItemMenu from 'renderer/layout/navigator/components/sidebar/tree/menus/ItemMenu';
import { usePopupState } from 'material-ui-popup-state/hooks';
import ItemContextMenu from 'renderer/layout/navigator/components/sidebar/tree/menus/ItemContextMenu';

type NavigatorTreeNodeProps = NodeRendererProps<TreeItem>;

const ListItemStyle = styled(ListItem<'div'>)(({ theme }) => ({
  ...typography.body2,
  height: NAVIGATOR_ITEM_HEIGHT,
  position: 'relative',
  '&:before': {
    top: 0,
    left: 0,
    width: 3,
    bottom: 0,
    content: "''",
    display: 'none',
    position: 'absolute',
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
    backgroundColor: theme.palette.primary.main,
  },
  '& .menu-toggle': {
    display: 'none',
  },
  '&:hover .menu-toggle': {
    display: 'flex',
  },
  '& .menu-open': {
    display: 'flex',
    color: theme.palette.primary.main,
  },
}));

const ListItemIconStyle = styled(ListItemIcon)(({ theme }) => ({
  width: 22,
  height: 22,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

export default function NavigatorTreeNode({ style, node, tree, dragHandle, preview }: NavigatorTreeNodeProps) {
  const theme = useTheme();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const menuState = usePopupState({ variant: 'popover' });

  const openMenuHandler = useCallback(
    (event: React.MouseEvent): void => {
      event.stopPropagation();
      event.preventDefault();

      menuState.open();
    },
    [menuState]
  );

  const contextMenuRef = useRef<HTMLElement | null>(null);

  const onContextMenuChange = useCallback(
    (open: boolean): void => {
      if (open) {
        node.focus();
      }
    },
    [node]
  );

  const itemClickHandler = useCallback(
    (event: React.MouseEvent): void => {
      node.select();
      navigate(getItemUrl(node.data));
    },
    [node]
  );

  const arrowIconClickHandler = useCallback(
    (event: React.MouseEvent): void => {
      event.stopPropagation();
      node.toggle();
    },
    [node]
  );

  const childItemCreatedHandler = useCallback(
    (item: Item): void => {
      node.open();
    },
    [node]
  );

  const color = useItemColor(node.data);
  const nameTooltip = useMemo<string | undefined>(() => getItemNameTooltip(node.data), [node.data]);
  const healthStatusColor = useMemo<string | undefined>(() => getItemHealthStatusColor(node.data), [node.data]);
  const itemIcon = useItemIcon(node.data);
  const ToggleIcon = useMemo<SvgIconComponent>(
    () => (node.isOpen ? KeyboardArrowDown : KeyboardArrowRight),
    [node.isOpen]
  );
  const showToggle = useMemo<boolean>(() => isFolder(node.data) || isApplication(node.data), [node.data]);
  const isSelected = useMemo<boolean>(
    () => matchPath({ path: getItemUrl(node.data), end: false }, pathname) !== null,
    [node.data, pathname]
  );
  const isFocused = useMemo<boolean>(
    () => node.isFocused && (!isSelected || !node.isOnlySelection),
    [isSelected, node.isFocused, node.isOnlySelection]
  );

  useEffect(() => {
    if (isSelected) {
      node.select();
    } else {
      node.deselect();
    }
  }, [isSelected]);

  const focusRootStyle = useMemo<SxProps<Theme>>(
    () => ({
      outline: `1px solid ${theme.palette.primary.lighter}`,
      outlineOffset: '-1px',
    }),
    [theme]
  );

  const activeRootStyle = useMemo<SxProps<Theme>>(
    () => ({
      bgcolor: alpha(theme.palette.primary.main, theme.palette.action.selectedOpacity),
      '&:before': { display: 'block' },
    }),
    [theme]
  );

  const stateStyle = useMemo<SxProps<Theme>>(
    () => ({
      ...(isFocused && focusRootStyle),
      ...(isSelected && activeRootStyle),
    }),
    [isFocused, isSelected, focusRootStyle, activeRootStyle]
  );

  return (
    <>
      <ItemMenu node={node} item={node.data} onCreated={childItemCreatedHandler} menuState={menuState} />
      <ItemContextMenu
        node={node}
        item={node.data}
        onCreated={childItemCreatedHandler}
        contextMenuRef={contextMenuRef}
        onContextMenuChange={onContextMenuChange}
      />

      <ListItemStyle
        ref={(el) => {
          dragHandle?.(el);
          contextMenuRef.current = el;
        }}
        component="div"
        // @ts-ignore
        button
        disableGutters
        disablePadding
        selected={isSelected}
        sx={stateStyle}
        style={style}
        onClick={itemClickHandler}
      >
        <IconButton
          onClick={arrowIconClickHandler}
          sx={{
            p: 0.25,
            mr: 0.5,
            ml: 1,
            color: 'text.primary',
            ...(showToggle ? {} : { visibility: 'hidden' }),
          }}
        >
          <ToggleIcon fontSize="small" />
        </IconButton>
        <ListItemIconStyle sx={{ color: color, mr: 1.5, ml: 0 }}>
          <Badge
            variant={'dot'}
            overlap={'circular'}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            sx={{
              '& .MuiBadge-badge': {
                width: 8,
                height: 8,
                backgroundColor: healthStatusColor,
              },
            }}
            invisible={!healthStatusColor}
          >
            <IconViewer icon={itemIcon} fontSize="small" />
          </Badge>
        </ListItemIconStyle>
        {!node.isEditing ? (
          <ListItemText
            disableTypography
            primary={
              <Tooltip title={nameTooltip}>
                <span>{node.data.alias}</span>
              </Tooltip>
            }
            sx={{
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          />
        ) : (
          <TextField
            autoFocus
            type={'text'}
            defaultValue={node.data.alias}
            size={'small'}
            variant={'outlined'}
            margin={'none'}
            InputProps={{
              onFocus: (e) => e.currentTarget.select(),
              onBlur: () => node.reset(),
              onKeyDown: (e) => {
                if (e.key === 'Escape') node.reset();
                if (e.key === 'Enter') node.submit(e.currentTarget.value);
              },
              sx: {
                height: NAVIGATOR_ITEM_HEIGHT - 8,
                fontSize: '12px',
              },
            }}
          />
        )}

        <IconButton
          sx={{
            p: 0.25,
            mr: 0.5,
            ml: 0.5,
          }}
          className={`menu-toggle ${menuState.isOpen ? 'menu-open' : ''}`}
          onClick={openMenuHandler}
          onMouseDown={(event) => event.stopPropagation()}
          ref={menuState.setAnchorEl}
        >
          <MoreVert fontSize="small" />
        </IconButton>
      </ListItemStyle>
    </>
  );
}
