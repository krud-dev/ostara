import React, { FunctionComponent, useMemo } from 'react';
import { Card, CardContent, CardHeader, Grow } from '@mui/material';
import { FormattedMessage } from 'react-intl';
import { ApplicationHealthStatus, ApplicationRO } from 'common/generated_definitions';
import Grid2 from '@mui/material/Unstable_Grid2';
import { ANIMATION_TIMEOUT_SHORT, COMPONENTS_SPACING } from 'renderer/constants/ui';
import { TransitionGroup } from 'react-transition-group';
import ApplicationHealthStatusDashboardWidget from 'renderer/components/widget/application/ApplicationHealthStatusDashboardWidget';

type ApplicationsHealthSummaryDashboardWidgetProps = {
  applications: ApplicationRO[];
};

const ApplicationsHealthSummaryDashboardWidget: FunctionComponent<ApplicationsHealthSummaryDashboardWidgetProps> = ({
  applications,
}) => {
  const healthStatuses = useMemo<ApplicationHealthStatus[]>(
    () => ['ALL_UP', 'ALL_DOWN', 'SOME_DOWN', 'EMPTY', 'UNKNOWN', 'PENDING'],
    []
  );

  return (
    <Card>
      <CardHeader title={<FormattedMessage id={'summary'} />} />
      <CardContent>
        <Grid2 container spacing={COMPONENTS_SPACING}>
          <TransitionGroup component={null}>
            {healthStatuses.map((healthStatus, index) => (
              <Grow timeout={(index + 2) * ANIMATION_TIMEOUT_SHORT} key={healthStatus}>
                <Grid2 xs={12} md={6} lg={4} xl={3} xxl={2}>
                  <ApplicationHealthStatusDashboardWidget applications={applications} healthStatus={healthStatus} />
                </Grid2>
              </Grow>
            ))}
          </TransitionGroup>
        </Grid2>
      </CardContent>
    </Card>
  );
};
export default ApplicationsHealthSummaryDashboardWidget;
