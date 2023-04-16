import { IconViewer, MUIconType } from './IconViewer';
import { Box, IconButton, Tooltip } from '@mui/material';
import { SxProps } from '@mui/system';
import { Theme } from '@mui/material/styles';
import React, { ReactNode } from 'react';
import { ColorSchema } from '../../theme/config/palette';

export type ToolbarButtonProps = {
  tooltip?: ReactNode;
  icon: MUIconType;
  color?: ColorSchema;
  disabled?: boolean;
  onClick?: (event: React.MouseEvent) => void;
  sx?: SxProps<Theme>;
};

export default function ToolbarButton({ tooltip, icon, color, disabled, onClick, sx }: ToolbarButtonProps) {
  return (
    <Box sx={{ display: 'inline-block', ...sx }}>
      <Tooltip title={tooltip} disableInteractive={false}>
        <Box component={'span'}>
          <IconButton disabled={disabled} color={color} onClick={onClick}>
            <IconViewer icon={icon} fontSize={'small'} />
          </IconButton>
        </Box>
      </Tooltip>
    </Box>
  );
}
