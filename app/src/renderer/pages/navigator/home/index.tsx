import React, { FunctionComponent } from 'react';
import { Box, Container, Grow, Stack } from '@mui/material';
import Page from 'renderer/components/layout/Page';
import { ANIMATION_GROW_TOP_STYLE, ANIMATION_TIMEOUT_LONG, COMPONENTS_SPACING } from '../../../constants/ui';
import Grid2 from '@mui/material/Unstable_Grid2';
import HomeWelcome from './components/HomeWelcome';
import HomeRepository from './components/HomeRepository';
import HomeGettingStarted from './components/HomeGettingStarted';
import HomeDocumentation from './components/HomeDocumentation';
import HomeWhatsNew from './components/HomeWhatsNew';
import { useSettings } from '../../../contexts/SettingsContext';
import HomeDeveloperMode from './components/HomeDeveloperMode';
import HomeFeedback from './components/HomeFeedback';
import { TransitionGroup } from 'react-transition-group';

const Home: FunctionComponent = () => {
  const { developerMode } = useSettings();
  return (
    <Page sx={{ height: '100%', display: 'flex', p: 0 }}>
      <Container disableGutters maxWidth={'md'} sx={{ m: 'auto', p: COMPONENTS_SPACING }}>
        <Grid2 container spacing={COMPONENTS_SPACING}>
          <Grid2 xs={12} lg={6}>
            <Stack direction={'column'} spacing={COMPONENTS_SPACING}>
              <TransitionGroup component={null}>
                <Grow timeout={ANIMATION_TIMEOUT_LONG} style={ANIMATION_GROW_TOP_STYLE}>
                  <Box>
                    <HomeWelcome />
                  </Box>
                </Grow>
                <Grow timeout={ANIMATION_TIMEOUT_LONG * 2} style={ANIMATION_GROW_TOP_STYLE}>
                  <Box>
                    <HomeGettingStarted />
                  </Box>
                </Grow>
                <Grow timeout={ANIMATION_TIMEOUT_LONG * 3} style={ANIMATION_GROW_TOP_STYLE}>
                  <Box>
                    <HomeRepository />
                  </Box>
                </Grow>
              </TransitionGroup>
            </Stack>
          </Grid2>
          <Grid2 xs={12} lg={6}>
            <Stack direction={'column'} spacing={COMPONENTS_SPACING} sx={{ height: '100%' }}>
              <TransitionGroup component={null}>
                <Grow timeout={ANIMATION_TIMEOUT_LONG} style={ANIMATION_GROW_TOP_STYLE}>
                  <Box>
                    <HomeDocumentation />
                  </Box>
                </Grow>
                <Grow timeout={ANIMATION_TIMEOUT_LONG * 2} style={ANIMATION_GROW_TOP_STYLE}>
                  <Box>
                    <HomeFeedback />
                  </Box>
                </Grow>
                <Grow timeout={ANIMATION_TIMEOUT_LONG * 3} style={ANIMATION_GROW_TOP_STYLE}>
                  <Box sx={{ flexGrow: 1, minHeight: 300 }}>
                    <HomeWhatsNew />
                  </Box>
                </Grow>
              </TransitionGroup>
            </Stack>
          </Grid2>
          {developerMode && (
            <Grid2 xs={12}>
              <TransitionGroup component={null}>
                <Grow timeout={ANIMATION_TIMEOUT_LONG * 4} style={ANIMATION_GROW_TOP_STYLE}>
                  <Box>
                    <HomeDeveloperMode />
                  </Box>
                </Grow>
              </TransitionGroup>
            </Grid2>
          )}
        </Grid2>
      </Container>
    </Page>
  );
};

export default Home;
