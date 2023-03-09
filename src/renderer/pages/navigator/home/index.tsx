import React, { FunctionComponent } from 'react';
import { Container } from '@mui/material';
import Page from 'renderer/components/layout/Page';

const Home: FunctionComponent = () => {
  return (
    <Page>
      <Container disableGutters>
        <h1>Actuator Playground</h1>
        <h2>isElectron: {JSON.stringify(window.isElectron)}</h2>

        <div>
          <h2>Flyway</h2>
          <p>https://sbclient.krud.dev/first/1/actuator</p>
          <p>https://sbclient.krud.dev/first/2/actuator</p>
          <p>https://sbclient.krud.dev/first/3/actuator</p>
        </div>
        <div>
          <h2>Liquibase</h2>
          <p>https://sbclient.krud.dev/second/1/actuator</p>
          <p>https://sbclient.krud.dev/second/2/actuator</p>
          <p>https://sbclient.krud.dev/second/3/actuator</p>
        </div>
        <div>
          <h2>Secure</h2>
          <p>https://sbclient.krud.dev/third/1/actuator</p>
          <p>https://sbclient.krud.dev/third/2/actuator</p>
          <p>https://sbclient.krud.dev/third/3/actuator</p>
        </div>
        <div>
          <h2>Daemon</h2>
          <p>{window.daemonAddress}/actuator</p>
        </div>
        <div>
          <h2>Swagger API Documentation</h2>
          <p>http://localhost:12222/swagger-ui/index.html</p>
        </div>
      </Container>
    </Page>
  );
};

export default Home;
