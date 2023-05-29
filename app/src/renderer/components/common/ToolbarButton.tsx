import { IconViewer, MUIconType } from './IconViewer';
import { Box, IconButton, Tooltip } from '@mui/material';
import { SxProps } from '@mui/system';
import { Theme } from '@mui/material/styles';
import React, { ReactNode, useCallback } from 'react';
import { ColorSchema } from '../../theme/config/palette';

export type ToolbarButtonProps = {
  tooltip?: ReactNode;
  icon: MUIconType;
  color?: ColorSchema;
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  onClick?: (event: React.MouseEvent) => void;
  sx?: SxProps<Theme>;
};

export default function ToolbarButton({ tooltip, icon, color, size, disabled, onClick, sx }: ToolbarButtonProps) {
  const wrapperClickHandler = useCallback((event: React.MouseEvent): void => {
    event.stopPropagation();
  }, []);

  return (
    <Box sx={{ display: 'inline-block', ...sx }}>
      <Tooltip title={tooltip} disableInteractive={false}>
        <Box component={'span'} onClick={wrapperClickHandler}>
          <IconButton disabled={disabled} color={color} size={size} onClick={onClick}>
            <IconViewer icon={icon} fontSize={'small'} />
          </IconButton>
        </Box>
      </Tooltip>
    </Box>
  );
}
