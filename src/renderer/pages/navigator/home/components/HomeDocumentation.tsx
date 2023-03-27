import { Button, Card, CardContent, Stack, Typography } from '@mui/material';
import React, { useCallback } from 'react';
import { FormattedMessage } from 'react-intl';
import { InstanceRO } from '../../../../../common/generated_definitions';
import NiceModal from '@ebay/nice-modal-react';
import CreateInstanceDialog from '../../../../components/item/dialogs/create/CreateInstanceDialog';
import { useNavigatorTree } from '../../../../contexts/NavigatorTreeContext';
import { DOCUMENTATION_URL, REPOSITORY_URL } from '../../../../constants/ui';

type HomeDocumentationProps = {};

export default function HomeDocumentation({}: HomeDocumentationProps) {
  return (
    <Card>
      <CardContent>
        <Typography variant={'h6'} gutterBottom>
          Documentation &#x1F4D6;
        </Typography>

        <Typography variant={'body2'} sx={{ color: 'text.secondary' }}>
          {
            'We have created a documentation site to help you get started with Boost. We continue to add more content to the site.'
          }
        </Typography>

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mt: 3 }}>
          <Button variant="outlined" color="primary" href={DOCUMENTATION_URL} target="_blank" rel="noopener noreferrer">
            <FormattedMessage id={'openDocumentation'} />
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
}
