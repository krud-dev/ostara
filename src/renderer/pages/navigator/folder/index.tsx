import React, { FunctionComponent } from 'react';
import { Container } from '@mui/material';
import Page from 'renderer/components/layout/Page';
import { useParams } from 'react-router-dom';

const FolderPage: FunctionComponent = () => {
  const { id } = useParams<{ id: string }>();
  return (
    <Page>
      <Container disableGutters>{`Folder ${id}`}</Container>
    </Page>
  );
};

export default FolderPage;
