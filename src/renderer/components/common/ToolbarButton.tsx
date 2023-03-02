import { IconViewer, MUIconType } from './IconViewer';
import { Box, IconButton, Tooltip } from '@mui/material';
import { FormattedMessage } from 'react-intl';
import { SxProps } from '@mui/system';
import { Theme } from '@mui/material/styles';

type ToolbarButtonProps = {
  tooltipLabelId: string;
  icon: MUIconType;
  onClick: () => void;
  sx?: SxProps<Theme>;
};

export default function ToolbarButton({ tooltipLabelId, icon, onClick, sx }: ToolbarButtonProps) {
  return (
    <Box sx={sx}>
      <Tooltip title={<FormattedMessage id={tooltipLabelId} />}>
        <IconButton onClick={onClick}>
          <IconViewer icon={icon} fontSize={'small'} />
        </IconButton>
      </Tooltip>
    </Box>
  );
}
