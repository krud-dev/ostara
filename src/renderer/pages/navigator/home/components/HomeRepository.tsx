import { Button, Card, CardContent, Stack, Typography } from '@mui/material';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { REPOSITORY_URL } from '../../../../constants/ui';

type HomeRepositoryProps = {};

export default function HomeRepository({}: HomeRepositoryProps) {
  return (
    <Card>
      <CardContent>
        <Typography variant={'h6'} gutterBottom>
          <FormattedMessage id={'appIsOpenSource'} /> &#x1F193;&#x1F91D;&#x1F4DC;
        </Typography>

        <Typography variant={'body2'} gutterBottom sx={{ color: 'text.secondary' }}>
          <FormattedMessage id={'checkOutTheSourceCode'} />
        </Typography>

        <Typography variant={'body2'} sx={{ color: 'text.secondary' }}>
          <FormattedMessage id={'considerStarringTheRepository'} /> &#x1F60A;
        </Typography>

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mt: 3 }}>
          <Button variant="outlined" color="primary" href={REPOSITORY_URL} target="_blank" rel="noopener noreferrer">
            <FormattedMessage id={'openRepository'} />
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
}
