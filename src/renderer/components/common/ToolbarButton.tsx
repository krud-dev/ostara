import { IconViewer, MUIconType } from './IconViewer';
import { Box, IconButton, Tooltip } from '@mui/material';
import { FormattedMessage } from 'react-intl';
import { SxProps } from '@mui/system';
import { Theme } from '@mui/material/styles';
import React from 'react';
import { ColorSchema } from '../../theme/config/palette';

export type ToolbarButtonProps = {
  tooltipLabelId: string;
  icon: MUIconType;
  color?: ColorSchema;
  disabled?: boolean;
  onClick?: (event: React.MouseEvent) => void;
  sx?: SxProps<Theme>;
};

export default function ToolbarButton({ tooltipLabelId, icon, color, disabled, onClick, sx }: ToolbarButtonProps) {
  return (
    <Box sx={{ display: 'inline-block', ...sx }}>
      <Tooltip title={<FormattedMessage id={tooltipLabelId} />}>
        <Box component={'span'}>
          <IconButton disabled={disabled} color={color} onClick={onClick}>
            <IconViewer icon={icon} fontSize={'small'} />
          </IconButton>
        </Box>
      </Tooltip>
    </Box>
  );
}
