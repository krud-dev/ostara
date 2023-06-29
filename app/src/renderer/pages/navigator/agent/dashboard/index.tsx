import React, { FunctionComponent, useMemo } from 'react';
import Page from 'renderer/components/layout/Page';
import { useNavigatorLayoutContext } from 'renderer/contexts/NavigatorLayoutContext';
import { Card, CardContent, CardHeader, Grow, Stack } from '@mui/material';
import { ApplicationHealthStatus, ApplicationRO } from 'common/generated_definitions';
import EmptyContent from 'renderer/components/help/EmptyContent';
import { FormattedMessage } from 'react-intl';
import {
  ANIMATION_GROW_TOP_STYLE,
  ANIMATION_TIMEOUT_LONG,
  ANIMATION_TIMEOUT_SHORT,
  COMPONENTS_SPACING,
} from 'renderer/constants/ui';
import Grid2 from '@mui/material/Unstable_Grid2';
import { isEmpty } from 'lodash';
import { useItemsContext } from 'renderer/contexts/ItemsContext';
import LogoLoaderCenter from 'renderer/components/common/LogoLoaderCenter';
import { TransitionGroup } from 'react-transition-group';
import FolderApplicationsHealthStatusWidget from 'renderer/pages/navigator/folder/dashboard/components/FolderApplicationsHealthStatusWidget';
import FolderApplicationWidget from 'renderer/pages/navigator/folder/dashboard/components/FolderApplicationWidget';

const AgentDashboard: FunctionComponent = () => {
  const { applications } = useItemsContext();
  const { selectedItem, data: navigatorData, getNewItemOrder } = useNavigatorLayoutContext();

  const data = useMemo<ApplicationRO[] | undefined>(
    () => applications?.filter((a) => a.parentAgentId === selectedItem?.id),
    [applications, selectedItem]
  );
  const loading = useMemo<boolean>(() => !data, [data]);

  const healthStatuses = useMemo<ApplicationHealthStatus[]>(
    () => ['ALL_UP', 'ALL_DOWN', 'SOME_DOWN', 'EMPTY', 'UNKNOWN', 'PENDING'],
    []
  );

  return (
    <Page sx={{ ...(loading ? { height: '100%' } : {}) }}>
      {loading ? (
        <LogoLoaderCenter />
      ) : (
        <Stack direction={'column'} spacing={COMPONENTS_SPACING}>
          <TransitionGroup component={null}>
            <Grow timeout={ANIMATION_TIMEOUT_LONG} style={ANIMATION_GROW_TOP_STYLE}>
              <Card>
                <CardHeader title={<FormattedMessage id={'summary'} />} />
                <CardContent>
                  <Grid2 container spacing={COMPONENTS_SPACING}>
                    <TransitionGroup component={null}>
                      {healthStatuses.map((healthStatus, index) => (
                        <Grow timeout={(index + 2) * ANIMATION_TIMEOUT_SHORT} key={healthStatus}>
                          <Grid2 xs={12} md={6} lg={4} xl={3} xxl={2}>
                            <FolderApplicationsHealthStatusWidget applications={data!} healthStatus={healthStatus} />
                          </Grid2>
                        </Grow>
                      ))}
                    </TransitionGroup>
                  </Grid2>
                </CardContent>
              </Card>
            </Grow>

            <Grow timeout={ANIMATION_TIMEOUT_LONG * 2} style={ANIMATION_GROW_TOP_STYLE}>
              <Card>
                <CardHeader title={<FormattedMessage id={'applications'} />} />
                <CardContent>
                  {isEmpty(data) ? (
                    <EmptyContent
                      text={<FormattedMessage id={'agentIsEmpty'} />}
                      description={<FormattedMessage id={'agentsDescription'} />}
                    />
                  ) : (
                    <Grid2 container spacing={COMPONENTS_SPACING}>
                      {data!.map((application) => (
                        <Grid2 xs={12} md={6} lg={4} xl={3} xxl={2} key={application.id}>
                          <FolderApplicationWidget application={application} />
                        </Grid2>
                      ))}
                    </Grid2>
                  )}
                </CardContent>
              </Card>
            </Grow>
          </TransitionGroup>
        </Stack>
      )}
    </Page>
  );
};

export default AgentDashboard;
