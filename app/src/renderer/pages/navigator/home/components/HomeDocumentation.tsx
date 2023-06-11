import { Button, Card, CardContent, Stack, Typography } from '@mui/material';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { DISCORD_INVITE_URL, DOCUMENTATION_URL } from 'renderer/constants/ui';
import DiscordIcon from 'renderer/components/icons/DiscordIcon';

type HomeDocumentationProps = {};

export default function HomeDocumentation({}: HomeDocumentationProps) {
  return (
    <Card>
      <CardContent>
        <Typography variant={'h6'} gutterBottom>
          <FormattedMessage id={'documentation'} /> &#x1F4D6;
        </Typography>

        <Typography variant={'body2'} sx={{ color: 'text.secondary', whiteSpace: 'pre-wrap' }}>
          <FormattedMessage id={'documentationSideGetStarted'} />
        </Typography>

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mt: 2 }}>
          <Button variant="outlined" color="primary" href={DOCUMENTATION_URL} target="_blank" rel="noopener noreferrer">
            <FormattedMessage id={'openDocumentation'} />
          </Button>
          <Button
            variant="outlined"
            color="primary"
            href={DISCORD_INVITE_URL}
            target="_blank"
            rel="noopener noreferrer"
            startIcon={<DiscordIcon />}
          >
            <FormattedMessage id={'joinDiscord'} />
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
}
