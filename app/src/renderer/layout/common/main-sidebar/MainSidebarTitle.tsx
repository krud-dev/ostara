import { ReactNode } from 'react';
import { COMPONENTS_SPACING, SIDEBAR_HEADER_HEIGHT } from 'renderer/constants/ui';
import { Box, Typography } from '@mui/material';
import { IconViewer, MUIconType } from 'renderer/components/common/IconViewer';

type MainSidebarTitleProps = {
  title: ReactNode;
  icon: MUIconType;
};

export default function MainSidebarTitle({ title, icon }: MainSidebarTitleProps) {
  return (
    <Box sx={{ height: SIDEBAR_HEADER_HEIGHT, display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', px: COMPONENTS_SPACING }}>
        <IconViewer icon={icon} fontSize={'medium'} sx={{ color: 'text.secondary', mr: 1 }} />
        <Typography variant={'h6'}>{title}</Typography>
      </Box>
    </Box>
  );
}
