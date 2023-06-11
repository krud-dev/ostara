import { Button, Card, CardContent, Stack, Typography } from '@mui/material';
import React, { useCallback } from 'react';
import { FormattedMessage } from 'react-intl';
import { DISCORD_INVITE_URL, REPOSITORY_ISSUES_URL } from 'renderer/constants/ui';
import NiceModal from '@ebay/nice-modal-react';
import AppFeedbackDialog from './AppFeedbackDialog';
import DiscordIcon from 'renderer/components/icons/DiscordIcon';
import GithubIcon from 'renderer/components/icons/GithubIcon';

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

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ my: 2 }}>
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

        <Typography variant={'body2'} gutterBottom sx={{ color: 'text.secondary' }}>
          <FormattedMessage id={'feedbackContactServices'} />
        </Typography>

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mt: 2 }}>
          <Button
            variant="outlined"
            color="primary"
            href={REPOSITORY_ISSUES_URL}
            target="_blank"
            rel="noopener noreferrer"
            startIcon={<GithubIcon />}
          >
            <FormattedMessage id={'openIssue'} />
          </Button>
          <Button
            variant="outlined"
            color="primary"
            href={DISCORD_INVITE_URL}
            target="_blank"
            rel="noopener noreferrer"
            startIcon={<DiscordIcon />}
          >
            <FormattedMessage id={'discord'} />
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
}
