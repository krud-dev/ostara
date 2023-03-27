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
          Boost is Open Source &#x1F193;&#x1F91D;&#x1F4DC;
        </Typography>

        <Typography variant={'body2'} gutterBottom sx={{ color: 'text.secondary' }}>
          Check out the source code on GitHub. Feel free to contribute, comment, open issues or ask questions.
        </Typography>

        <Typography variant={'body2'} sx={{ color: 'text.secondary' }}>
          If you find Boost useful, please consider starring the repository. Thank you! &#x1F60A;
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
