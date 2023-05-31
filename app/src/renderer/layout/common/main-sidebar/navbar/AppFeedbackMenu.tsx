import React, { useCallback } from 'react';
import { RateReviewOutlined } from '@mui/icons-material';
import NiceModal from '@ebay/nice-modal-react';
import AppFeedbackDialog from '../../../../pages/navigator/home/components/AppFeedbackDialog';
import NavbarIconButton from './NavbarIconButton';

export default function AppFeedbackMenu() {
  const sendFeedbackHandler = useCallback(async (): Promise<void> => {
    await NiceModal.show<boolean>(AppFeedbackDialog);
  }, []);

  return <NavbarIconButton titleId={'sendFeedback'} icon={'RateReviewOutlined'} onClick={sendFeedbackHandler} />;
}
