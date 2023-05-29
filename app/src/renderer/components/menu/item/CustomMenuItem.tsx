import React, { ReactNode } from 'react';
import { ListItemIcon, ListItemText, MenuItem, MenuItemProps } from '@mui/material';
import { IconViewer, MUIconType } from 'renderer/components/common/IconViewer';

export type CustomMenuItemProps = {
  icon?: MUIconType;
  text?: ReactNode;
  color?: string;
  info?: ReactNode;
} & MenuItemProps;

export default function CustomMenuItem({ icon, text, color, info, sx, children, ...props }: CustomMenuItemProps) {
  return (
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
  );
}
