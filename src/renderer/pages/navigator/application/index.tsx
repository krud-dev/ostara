import React, { FunctionComponent } from 'react';
import { Container } from '@mui/material';
import Page from 'renderer/components/layout/Page';
import { useParams } from 'react-router-dom';

const ApplicationPage: FunctionComponent = () => {
  const { id } = useParams<{ id: string }>();
  return (
    <Page>
      <Container disableGutters>{`Application ${id}`}</Container>
    </Page>
  );
};

export default ApplicationPage;
