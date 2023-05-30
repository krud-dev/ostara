import { Button, Card, CardContent, Stack, Typography } from '@mui/material';
import React, { useCallback } from 'react';
import { FormattedMessage } from 'react-intl';
import { DISCORD_INVITE_URL, REPOSITORY_ISSUES_URL } from '../../../../constants/ui';
import NiceModal from '@ebay/nice-modal-react';
import AppFeedbackDialog from './AppFeedbackDialog';

type HomeFeedbackProps = {};

export default function HomeFeedback({}: HomeFeedbackProps) {
  const sendFeedbackHandler = useCallback(async (): Promise<void> => {
    await NiceModal.show<boolean>(AppFeedbackDialog);
  }, []);

  return (
    <Card>
      <CardContent>
        <Typography variant={'h6'} gutterBottom>
          <FormattedMessage id={'feedback'} /> &#128221;
        </Typography>

        <Typography variant={'body2'} gutterBottom sx={{ color: 'text.secondary' }}>
          <FormattedMessage id={'feedbackHelpImprove'} />
        </Typography>

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mt: 3 }}>
          <Button
            variant="outlined"
            color="primary"
            href={REPOSITORY_ISSUES_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            <FormattedMessage id={'openIssue'} />
          </Button>
          <Button
            variant="outlined"
            color="primary"
            href={DISCORD_INVITE_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            <FormattedMessage id={'joinDiscord'} />
          </Button>
          <Button variant="outlined" color="primary" onClick={sendFeedbackHandler}>
            <FormattedMessage id={'sendFeedback'} />
          </Button>
          {/*<Button*/}
          {/*  variant="outlined"*/}
          {/*  color="primary"*/}
          {/*  href={`mailto:${SUPPORT_EMAIL}`}*/}
          {/*  target="_blank"*/}
          {/*  rel="noopener noreferrer"*/}
          {/*>*/}
          {/*  <FormattedMessage id={'sendEmail'} />*/}
          {/*</Button>*/}
        </Stack>
      </CardContent>
    </Card>
  );
}
