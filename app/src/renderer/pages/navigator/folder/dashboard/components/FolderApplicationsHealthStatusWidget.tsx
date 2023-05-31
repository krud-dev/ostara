import React, { FunctionComponent, useMemo } from 'react';
import { Box, Card, CardContent, Stack, Typography } from '@mui/material';
import { FormattedMessage } from 'react-intl';
import { ApplicationHealthStatus, ApplicationRO } from '../../../../../../common/generated_definitions';
import {
  getApplicationHealthStatusColor,
  getApplicationHealthStatusIcon,
  getApplicationHealthStatusTextId,
} from '../../../../../utils/itemUtils';
import { IconViewer, MUIconType } from '../../../../../components/common/IconViewer';

type FolderApplicationsHealthStatusWidgetProps = {
  applications: ApplicationRO[];
  healthStatus: ApplicationHealthStatus;
};

const FolderApplicationsHealthStatusWidget: FunctionComponent<FolderApplicationsHealthStatusWidgetProps> = ({
  applications,
  healthStatus,
}) => {
  const titleId = useMemo<string>(
    () => getApplicationHealthStatusTextId(healthStatus) || 'notAvailable',
    [healthStatus]
  );
  const color = useMemo<string>(() => getApplicationHealthStatusColor(healthStatus) || 'transparent', [healthStatus]);
  const icon = useMemo<MUIconType>(() => getApplicationHealthStatusIcon(healthStatus), [healthStatus]);
  const count = useMemo<number>(
    () => applications.filter((application) => application.health.status === healthStatus).length,
    [applications, healthStatus]
  );
  const percentage = useMemo<string>(
    () => (applications.length > 0 ? (count / applications.length) * 100 : 0).toFixed(0),
    [count, applications]
  );

  return (
    <Card
      variant={'outlined'}
      sx={{
        height: '100%',
        borderColor: count > 0 ? color : undefined,
        transition: 'border-color 0.5s',
      }}
    >
      <CardContent>
        <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'}>
          <Box>
            <Typography variant={'subtitle2'} component={'div'} sx={{ color: 'text.secondary' }}>
              <FormattedMessage id={titleId} />
            </Typography>
            <Typography variant={'h3'} component={'div'} sx={{ lineHeight: 1.2 }}>
              {count}
            </Typography>
            <Typography variant={'body2'} component={'div'} sx={{ color: 'text.secondary' }}>
              {percentage}%
            </Typography>
          </Box>
          <IconViewer icon={icon} sx={{ color, fontSize: 52 }} />
        </Stack>
      </CardContent>
    </Card>
  );
};
export default FolderApplicationsHealthStatusWidget;
