import * as React from 'react';
import { ReactNode, useMemo } from 'react';
import { Tooltip } from '@mui/material';
import { HelpOutlineOutlined } from '@mui/icons-material';
import { SxProps } from '@mui/system';
import { Theme } from '@mui/material/styles';

export type HelpIconProps = {
  title?: ReactNode;
  invisible?: boolean;
  sx?: SxProps<Theme>;
};

const HelpIcon = ({ title, invisible = false, sx }: HelpIconProps) => {
  const show = useMemo<boolean>(() => !!title && !invisible, [title, invisible]);

  if (!show) {
    return null;
  }

  return (
    <Tooltip title={title} placement="top">
      <HelpOutlineOutlined fontSize={'small'} sx={sx} />
    </Tooltip>
  );
};

export default HelpIcon;
