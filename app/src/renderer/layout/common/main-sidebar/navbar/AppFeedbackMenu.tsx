import React, { useCallback } from 'react';
import { Box, IconButton, Tooltip } from '@mui/material';
import { RateReviewOutlined } from '@mui/icons-material';
import { FormattedMessage } from 'react-intl';
import { NAVBAR_TOOLTIP_DELAY } from '../MainNavbar';
import NiceModal from '@ebay/nice-modal-react';
import AppFeedbackDialog from '../../../../pages/navigator/home/components/AppFeedbackDialog';

export default function AppFeedbackMenu() {
  const sendFeedbackHandler = useCallback(async (): Promise<void> => {
    await NiceModal.show<boolean>(AppFeedbackDialog);
  }, []);

  return (
    <Box sx={{ '-webkit-app-region': 'no-drag' }}>
      <Tooltip title={<FormattedMessage id={'sendFeedback'} />} enterDelay={NAVBAR_TOOLTIP_DELAY}>
        <IconButton size={'small'} onClick={sendFeedbackHandler} sx={{ color: 'text.primary' }}>
          <RateReviewOutlined fontSize={'medium'} />
        </IconButton>
      </Tooltip>
    </Box>
  );
}
