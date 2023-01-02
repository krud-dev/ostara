import { ReactNode, useCallback } from 'react';
import { COMPONENTS_SPACING, NAVBAR_HEIGHT } from 'renderer/constants/ui';
import { Box, Divider, IconButton, Typography } from '@mui/material';
import { IconViewer } from 'renderer/components/icon/IconViewer';
import { useUi } from 'renderer/contexts/UiContext';
import { useNavigate } from 'react-router-dom';

type MainSidebarTitleProps = {
  title: ReactNode;
};

export default function MainSidebarTitle({ title }: MainSidebarTitleProps) {
  const { isRtl } = useUi();
  const navigate = useNavigate();

  const backHandler = useCallback((): void => {
    navigate(-1);
  }, []);

  return (
    <Box sx={{ height: NAVBAR_HEIGHT, minHeight: NAVBAR_HEIGHT, display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', px: COMPONENTS_SPACING }}>
        <IconButton size={'small'} sx={{ mr: 1 }} onClick={backHandler}>
          <IconViewer
            icon={isRtl ? 'KeyboardArrowRightOutlined' : 'KeyboardArrowLeftOutlined'}
            fontSize={'medium'}
            sx={{ color: 'text.primary' }}
          />
        </IconButton>
        <Typography variant={'h6'}>{title}</Typography>
      </Box>

      <Divider />
    </Box>
  );
}
