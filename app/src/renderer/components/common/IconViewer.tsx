import { SvgIconProps } from '@mui/material/SvgIcon';
import * as MUIcon from '@mui/icons-material';
import * as React from 'react';
import { useMemo } from 'react';
import { SvgIconComponent } from '@mui/icons-material';

export type MUIconType = keyof typeof MUIcon;

type IconViewerProps = SvgIconProps & {
  icon?: MUIconType;
};

export const IconViewer: React.FC<IconViewerProps> = ({ icon, ...props }) => {
  const Icon = useMemo<SvgIconComponent | undefined>(() => icon && MUIcon[icon], [icon]);
  return <>{Icon && <Icon {...props} />}</>;
};
