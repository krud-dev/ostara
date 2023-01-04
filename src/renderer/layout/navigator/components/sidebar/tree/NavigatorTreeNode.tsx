import { NodeRendererProps } from 'react-arborist';
import { Badge, IconButton, ListItem, ListItemIcon, ListItemText, TextField } from '@mui/material';
import { alpha, experimentalStyled as styled, Theme, useTheme } from '@mui/material/styles';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { TreeItem, TreeItemContextMenuProps } from 'renderer/layout/navigator/components/sidebar/tree/tree';
import typography from 'renderer/theme/config/typography';
import { KeyboardArrowDown, KeyboardArrowRight, MoreVert, SvgIconComponent } from '@mui/icons-material';
import { NAVIGATOR_ITEM_HEIGHT } from 'renderer/constants/ui';
import { getItemHealthStatusColor, getItemUrl } from 'renderer/utils/itemUtils';
import FolderContextMenu from 'renderer/layout/navigator/components/sidebar/tree/menus/FolderContextMenu';
import { isApplication, isFolder, isInstance, Item } from 'infra/configuration/model/configuration';
import InstanceContextMenu from 'renderer/layout/navigator/components/sidebar/tree/menus/InstanceContextMenu';
import ApplicationContextMenu from 'renderer/layout/navigator/components/sidebar/tree/menus/ApplicationContextMenu';
import { SxProps } from '@mui/system';
import { matchPath, useLocation, useNavigate } from 'react-router-dom';
import useItemColor from 'renderer/hooks/useItemColor';
import { IconViewer } from 'renderer/components/icon/IconViewer';
import useItemIcon from 'renderer/hooks/useItemIcon';

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

  useEffect(() => {
    const itemPath = getItemUrl(node.data);
    const isActive = matchPath({ path: itemPath, end: false }, pathname) !== null;
    if (isActive && !isSelected) {
      node.select();
      node.openParents();
    } else if (!isActive && isSelected) {
      node.deselect();
    }
  }, [pathname]);

  const contextMenuRef = useRef<HTMLElement | null>(null);
  const clickRef = useRef<HTMLButtonElement>(null);

  const [menuOpen, setMenuOpen] = useState<boolean>(false);

  const onContextMenuChange = useCallback(
    (open: boolean): void => {
      if (open) {
        node.focus();
      }
    },
    [node]
  );

  const onClickChange = useCallback(
    (open: boolean): void => {
      setMenuOpen(open);
      onContextMenuChange(open);
    },
    [setMenuOpen, onContextMenuChange]
  );

  const itemClickHandler = useCallback(
    (event?: React.MouseEvent): void => {
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

  const contextMenuProps = useMemo<TreeItemContextMenuProps>(
    () => ({
      item: node.data,
      node: node,
      onCreated: childItemCreatedHandler,
      contextMenuRef: contextMenuRef,
      clickRef: clickRef,
      onContextMenuChange: onContextMenuChange,
      onClickChange: onClickChange,
    }),
    [node]
  );

  return (
    <>
      {isFolder(node.data) && <FolderContextMenu {...contextMenuProps} />}
      {isApplication(node.data) && <ApplicationContextMenu {...contextMenuProps} />}
      {isInstance(node.data) && <InstanceContextMenu {...contextMenuProps} />}

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
            primary={node.data.alias}
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
          ref={clickRef}
          sx={{
            p: 0.25,
            mr: 0.5,
            ml: 0.5,
          }}
          className={`menu-toggle ${menuOpen ? 'menu-open' : ''}`}
        >
          <MoreVert fontSize="small" />
        </IconButton>
      </ListItemStyle>
    </>
  );
}
