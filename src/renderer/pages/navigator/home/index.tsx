import React, { FunctionComponent } from 'react';
import { Container } from '@mui/material';
import Page from 'renderer/components/layout/Page';

const Home: FunctionComponent = () => {
  return (
    <Page>
      <Container disableGutters>
        <h1>Actuator Playground</h1>
        <h2>isElectron: {JSON.stringify(window.isElectron)}</h2>
        <p>https://sbclient.krud.dev/first/1/actuator</p>
        <p>https://sbclient.krud.dev/first/2/actuator</p>
        <p>https://sbclient.krud.dev/first/3/actuator</p>
        <p>https://sbclient.krud.dev/second/1/actuator</p>
        <p>https://sbclient.krud.dev/second/2/actuator</p>
        <p>https://sbclient.krud.dev/second/3/actuator</p>
        <p>https://sbclient.krud.dev/third/1/actuator</p>
        <p>https://sbclient.krud.dev/third/2/actuator</p>
        <p>https://sbclient.krud.dev/third/3/actuator</p>
      </Container>
    </Page>
  );
};

export default Home;
