import React, { ReactNode } from 'react';
import { Box, ListItemIcon, ListItemText, MenuItem, MenuItemProps, Tooltip } from '@mui/material';
import { IconViewer, MUIconType } from 'renderer/components/common/IconViewer';

export type CustomMenuItemProps = {
  icon?: MUIconType;
  text?: ReactNode;
  color?: string;
  info?: ReactNode;
  tooltip?: ReactNode;
} & MenuItemProps;

export default function CustomMenuItem({
  icon,
  text,
  color,
  info,
  tooltip,
  sx,
  children,
  ...props
}: CustomMenuItemProps) {
  return (
    <Tooltip title={tooltip} placement={'right'}>
      <Box>
        <MenuItem
          {...props}
          sx={{
            color: color,
            '.MuiListItemIcon-root': { color: color },
            '&:hover': { color: 'text.primary', backgroundColor: color },
            '&:hover .MuiListItemIcon-root': { color: 'text.primary' },
            ...sx,
          }}
        >
          {icon && (
            <ListItemIcon>
              <IconViewer icon={icon} fontSize="small" />
            </ListItemIcon>
          )}
          <ListItemText>
            {text}
            {children}
          </ListItemText>
          {info}
        </MenuItem>
      </Box>
    </Tooltip>
  );
}
