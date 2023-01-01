import { SvgIconComponent } from '@mui/icons-material';
import React, { ReactNode } from 'react';
import { ListItemIcon, ListItemText, MenuItem, MenuItemProps } from '@mui/material';

export type CustomMenuItemProps = {
  Icon?: SvgIconComponent;
  text?: ReactNode;
  color?: string;
  info?: ReactNode;
} & MenuItemProps;

export default function CustomMenuItem({ Icon, text, color, info, sx, children, ...props }: CustomMenuItemProps) {
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
      {Icon && (
        <ListItemIcon>
          <Icon fontSize="small" />
        </ListItemIcon>
      )}
      <ListItemText>
        {text}
        {children}
      </ListItemText>
      {info && info}
    </MenuItem>
  );
}
