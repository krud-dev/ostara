import { ReactNode } from 'react';
import { COMPONENTS_SPACING, NAVBAR_HEIGHT } from 'renderer/constants/ui';
import { Box, Divider, Typography } from '@mui/material';
import { IconViewer, MUIconType } from 'renderer/components/common/IconViewer';

type MainSidebarTitleProps = {
  title: ReactNode;
  icon: MUIconType;
};

export default function MainSidebarTitle({ title, icon }: MainSidebarTitleProps) {
  return (
    <Box sx={{ height: NAVBAR_HEIGHT, minHeight: NAVBAR_HEIGHT, display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', px: COMPONENTS_SPACING }}>
        <IconViewer icon={icon} fontSize={'medium'} sx={{ color: 'text.secondary', mr: 1 }} />
        <Typography variant={'h6'}>{title}</Typography>
      </Box>

      <Divider />
    </Box>
  );
}
