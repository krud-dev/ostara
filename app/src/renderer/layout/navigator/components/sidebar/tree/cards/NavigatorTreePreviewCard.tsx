import React, { useMemo } from 'react';
import { BackupDTO } from 'common/generated_definitions';
import { Card } from '@mui/material';
import { NAVIGATOR_ITEM_HEIGHT } from 'renderer/constants/ui';
import { SxProps } from '@mui/system';
import { Theme } from '@mui/material/styles';
import NavigatorTreePreview from 'renderer/layout/navigator/components/sidebar/tree/NavigatorTreePreview';
import LogoLoaderCenter from 'renderer/components/common/LogoLoaderCenter';

type NavigatorTreePreviewCardProps = {
  backup?: BackupDTO;
  sx?: SxProps<Theme>;
};

export default function NavigatorTreePreviewCard({ backup, sx }: NavigatorTreePreviewCardProps) {
  const height = useMemo<number>(() => NAVIGATOR_ITEM_HEIGHT * 6, []);

  return (
    <Card variant={'outlined'} sx={{ height: height, ...sx }}>
      {backup ? <NavigatorTreePreview backup={backup} /> : <LogoLoaderCenter />}
    </Card>
  );
}
