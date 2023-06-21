import React, { useMemo } from 'react';
import { BackupDTO } from 'common/generated_definitions';
import { Card } from '@mui/material';
import { NAVIGATOR_ITEM_HEIGHT } from 'renderer/constants/ui';
import { SxProps } from '@mui/system';
import { Theme } from '@mui/material/styles';
import NavigatorTreePreview from 'renderer/layout/navigator/components/sidebar/tree/NavigatorTreePreview';
import LogoLoaderCenter from 'renderer/components/common/LogoLoaderCenter';
import { isEmpty } from 'lodash';
import EmptyContent from 'renderer/components/help/EmptyContent';
import { FormattedMessage } from 'react-intl';

type NavigatorTreePreviewCardProps = {
  backup?: BackupDTO;
  sx?: SxProps<Theme>;
};

export default function NavigatorTreePreviewCard({ backup, sx }: NavigatorTreePreviewCardProps) {
  const height = useMemo<number>(() => NAVIGATOR_ITEM_HEIGHT * 6, []);

  const uiStatus = useMemo<'loading' | 'empty' | 'content'>(() => {
    if (!backup) {
      return 'loading';
    }
    if (isEmpty(backup.tree)) {
      return 'empty';
    }
    return 'content';
  }, [backup]);

  return (
    <Card variant={'outlined'} sx={{ height: height, ...sx }}>
      {uiStatus === 'loading' && <LogoLoaderCenter />}
      {uiStatus === 'empty' && <EmptyContent description={<FormattedMessage id={'selectedConfigurationIsEmpty'} />} />}
      {uiStatus === 'content' && <NavigatorTreePreview backup={backup!} />}
    </Card>
  );
}
