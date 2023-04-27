import React, { FunctionComponent } from 'react';
import { FormattedMessage } from 'react-intl';
import { Box, Button, Container, Stack, Typography } from '@mui/material';
import { experimentalStyled as styled } from '@mui/material/styles';
import { Link as RouterLink } from 'react-router-dom';
import Page from 'renderer/components/layout/Page';

const RootStyle = styled(Page)(({ theme }) => ({
  display: 'flex',
  minHeight: '100%',
  alignItems: 'center',
  paddingTop: theme.spacing(10),
  paddingBottom: theme.spacing(10),
}));

interface ErrorProps {}

const Error: FunctionComponent<ErrorProps> = (props: ErrorProps) => {
  return (
    <RootStyle>
      <Container>
        <Box sx={{ maxWidth: 480, margin: 'auto', textAlign: 'center' }}>
          <Typography variant="h3">
            <FormattedMessage id="somethingWentWrong" />
          </Typography>
          <Typography sx={{ color: 'text.secondary', mt: 1 }}>
            <FormattedMessage id="somethingWentWrongExplanation" />
          </Typography>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ display: 'inline-flex', mt: 3 }}>
            <Button size="large" variant="contained" to="/" component={RouterLink}>
              <FormattedMessage id="goToHome" />
            </Button>
            {/* <Button */}
            {/*  size="large" */}
            {/*  variant="outlined" */}
            {/*  href={supportUrl} */}
            {/*  target="_blank" */}
            {/*  rel="noopener noreferrer" */}
            {/* > */}
            {/*  <FormattedMessage id="contactSupport" /> */}
            {/* </Button> */}
          </Stack>
        </Box>
      </Container>
    </RootStyle>
  );
};

export default Error;
