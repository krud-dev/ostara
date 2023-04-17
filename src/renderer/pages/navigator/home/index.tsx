import React, { FunctionComponent } from 'react';
import { Container, Stack } from '@mui/material';
import Page from 'renderer/components/layout/Page';
import { COMPONENTS_SPACING } from '../../../constants/ui';
import Grid2 from '@mui/material/Unstable_Grid2';
import HomeWelcome from './components/HomeWelcome';
import HomeRepository from './components/HomeRepository';
import HomeGettingStarted from './components/HomeGettingStarted';
import HomeDocumentation from './components/HomeDocumentation';
import HomeWhatsNew from './components/HomeWhatsNew';
import { useSettings } from '../../../contexts/SettingsContext';
import HomeDeveloperMode from './components/HomeDeveloperMode';

const Home: FunctionComponent = () => {
  const { developerMode } = useSettings();
  return (
    <Page sx={{ height: '100%', display: 'flex', p: 0 }}>
      <Container disableGutters maxWidth={'md'} sx={{ m: 'auto', p: COMPONENTS_SPACING }}>
        <Grid2 container spacing={COMPONENTS_SPACING}>
          <Grid2 xs={12} lg={6}>
            <Stack direction={'column'} spacing={COMPONENTS_SPACING}>
              <HomeWelcome />
              <HomeGettingStarted />
              <HomeDocumentation />
            </Stack>
          </Grid2>
          <Grid2 xs={12} lg={6}>
            <Stack direction={'column'} spacing={COMPONENTS_SPACING} sx={{ height: '100%' }}>
              <HomeRepository />
              <HomeWhatsNew />
            </Stack>
          </Grid2>
          {developerMode && (
            <Grid2 xs={12}>
              <HomeDeveloperMode />
            </Grid2>
          )}
        </Grid2>
      </Container>
    </Page>
  );
};

export default Home;
