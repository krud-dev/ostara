import Page from 'renderer/components/layout/Page';
import React from 'react';
import LogoLoader from '../common/LogoLoader';

type LoadingPageProps = {};

export default function LoadingPage({}: LoadingPageProps) {
  return (
    <Page
      sx={{
        height: '100%',
        display: 'flex',
        textAlign: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'center',
      }}
    >
      <LogoLoader />
    </Page>
  );
}
