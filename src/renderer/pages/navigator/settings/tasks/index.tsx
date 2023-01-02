import React, { FunctionComponent } from 'react';
import { Container } from '@mui/material';
import Page from 'renderer/components/layout/Page';

const TasksPage: FunctionComponent = () => {
  return (
    <Page>
      <Container disableGutters>{`Tasks`}</Container>
    </Page>
  );
};

export default TasksPage;
