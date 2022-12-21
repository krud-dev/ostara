import { NodeRendererProps } from 'react-arborist';
import { IconButton, ListItem, ListItemIcon, ListItemText, TextField } from '@mui/material';
import { alpha, experimentalStyled as styled, useTheme } from '@mui/material/styles';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { TreeItem } from 'renderer/layout/navigator/components/sidebar/tree/tree';
import typography from 'renderer/theme/config/typography';
import { KeyboardArrowDown, KeyboardArrowRight, MoreVert, SvgIconComponent } from '@mui/icons-material';
import { NAVIGATOR_ITEM_HEIGHT } from 'renderer/constants/ui';
import { getItemTypeIcon } from 'renderer/utils/itemUtils';
import FolderContextMenu from 'renderer/layout/navigator/components/sidebar/tree/menus/FolderContextMenu';
import { isApplication, isFolder, isInstance, Item } from 'infra/configuration/model/configuration';
import InstanceContextMenu from 'renderer/layout/navigator/components/sidebar/tree/menus/InstanceContextMenu';
import ApplicationContextMenu from 'renderer/layout/navigator/components/sidebar/tree/menus/ApplicationContextMenu';

type NavigatorTreeNodeProps = NodeRendererProps<TreeItem>;

const ListItemStyle = styled(ListItem<'div'>)(({ theme }) => ({
  ...typography.body2,
  height: NAVIGATOR_ITEM_HEIGHT,
  position: 'relative',
  textTransform: 'capitalize',
  '&:before': {
    top: 0,
    left: 0,
    width: 3,
    bottom: 0,
    content: "''",
    display: 'none',
    position: 'absolute',
    borderTopLeftRadius: 4,
    borderBottomLeftRadius: 4,
    backgroundColor: theme.palette.primary.main,
  },
  '& .menu-toggle': {
    visibility: 'hidden',
  },
  '&:hover .menu-toggle': {
    visibility: 'visible',
  },
  '& .menu-open': {
    visibility: 'visible',
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

  const contextMenuAnchorRef = useRef<HTMLButtonElement | null>(null);
  const [contextMenuAnchor, setContextMenuAnchor] = useState<Element | undefined>(undefined);
  const [contextMenuOpen, setContextMenuOpen] = useState<boolean>(false);

  const openContextMenu = useCallback((event?: React.MouseEvent<Element>): void => {
    if (event) {
      event.preventDefault();
      node.select();

      const virtualElement: any = {
        getBoundingClientRect: () => ({
          width: 0,
          height: 0,
          top: event.clientY,
          right: event.clientX,
          bottom: event.clientY,
          left: event.clientX,
        }),
      };
      setContextMenuAnchor(virtualElement);
    }
    setContextMenuOpen(true);
  }, []);

  const closeContextMenu = useCallback((): void => {
    setContextMenuAnchor(undefined);
    setContextMenuOpen(false);
  }, []);

  const ToggleIcon = useMemo<SvgIconComponent>(() => {
    return node.isOpen ? KeyboardArrowDown : KeyboardArrowRight;
  }, [node.isOpen]);

  const TypeIcon = useMemo<SvgIconComponent>(() => getItemTypeIcon(node.data.type), [node.data]);

  const showToggle = useMemo<boolean>(() => isFolder(node.data) || isApplication(node.data), [node.data]);

  const color = useMemo<string>(() => node.data.color || theme.palette.text.secondary, [node.data, theme.palette]);

  const activeRootStyle = {
    // color: 'primary.main',
    bgcolor: alpha(theme.palette.primary.main, theme.palette.action.selectedOpacity),
    '&:before': { display: 'block' },
  };

  const focusRootStyle = {
    outline: `1px solid ${theme.palette.primary.lighter}`,
    outlineOffset: '-1px',
  };

  const onArrowClick = useCallback(
    (event: React.MouseEvent): void => {
      event.stopPropagation();
      node.toggle();
    },
    [node]
  );

  const onMenuClick = useCallback(
    (event: React.MouseEvent): void => {
      event.stopPropagation();
      openContextMenu();
    },
    [openContextMenu]
  );

  const onChildItemCreated = useCallback(
    (item: Item): void => {
      node.open();
    },
    [node]
  );

  return (
    <>
      {isFolder(node.data) && (
        <FolderContextMenu
          node={node}
          open={contextMenuOpen}
          anchorEl={contextMenuAnchor || contextMenuAnchorRef.current}
          onClose={closeContextMenu}
          onCreated={onChildItemCreated}
        />
      )}
      {isApplication(node.data) && (
        <ApplicationContextMenu
          node={node}
          open={contextMenuOpen}
          anchorEl={contextMenuAnchor || contextMenuAnchorRef.current}
          onClose={closeContextMenu}
          onCreated={onChildItemCreated}
        />
      )}
      {isInstance(node.data) && (
        <InstanceContextMenu
          node={node}
          open={contextMenuOpen}
          anchorEl={contextMenuAnchor || contextMenuAnchorRef.current}
          onClose={closeContextMenu}
          onCreated={onChildItemCreated}
        />
      )}

      <ListItemStyle
        ref={dragHandle}
        component="div"
        disableGutters
        disablePadding
        sx={{
          ...(node.isFocused && (!node.isSelected || !node.isOnlySelection) && focusRootStyle),
          ...(node.isSelected && activeRootStyle),
        }}
        style={style}
        onContextMenu={openContextMenu}
      >
        <IconButton
          onClick={onArrowClick}
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
        <ListItemIconStyle sx={{ color: color, mr: 1, ml: 0 }}>
          <TypeIcon fontSize="small" />
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
                height: NAVIGATOR_ITEM_HEIGHT - 6,
                fontSize: '12px',
              },
            }}
          />
        )}
        <IconButton
          ref={contextMenuAnchorRef}
          onClick={onMenuClick}
          sx={{
            p: 0.25,
            mr: 0.5,
            ml: 0.5,
          }}
          className={`menu-toggle ${contextMenuOpen ? 'menu-open' : ''}`}
        >
          <MoreVert fontSize="small" />
        </IconButton>
      </ListItemStyle>
    </>
  );
}
