import React, { FunctionComponent } from 'react';
import { Container } from '@mui/material';
import Sample from 'renderer/demo/Sample';
import Page from 'renderer/components/layout/Page';

const Home: FunctionComponent = () => {
  return (
    <Page>
      <Container disableGutters>
        <Sample />
      </Container>
    </Page>
  );
};

export default Home;
