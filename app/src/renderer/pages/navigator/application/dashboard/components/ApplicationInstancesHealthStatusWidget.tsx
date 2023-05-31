import React, { FunctionComponent, useMemo } from 'react';
import { Box, Card, CardContent, Stack, Typography } from '@mui/material';
import { FormattedMessage } from 'react-intl';
import { InstanceHealthStatus, InstanceRO } from '../../../../../../common/generated_definitions';
import {
  getInstanceHealthStatusColor,
  getInstanceHealthStatusIcon,
  getInstanceHealthStatusTextId,
} from '../../../../../utils/itemUtils';
import { IconViewer, MUIconType } from '../../../../../components/common/IconViewer';

type ApplicationInstancesHealthStatusWidgetProps = {
  instances: InstanceRO[];
  healthStatus: InstanceHealthStatus;
};

const ApplicationInstancesHealthStatusWidget: FunctionComponent<ApplicationInstancesHealthStatusWidgetProps> = ({
  instances,
  healthStatus,
}) => {
  const titleId = useMemo<string>(() => getInstanceHealthStatusTextId(healthStatus) || 'notAvailable', [healthStatus]);
  const color = useMemo<string>(() => getInstanceHealthStatusColor(healthStatus) || 'transparent', [healthStatus]);
  const icon = useMemo<MUIconType>(() => getInstanceHealthStatusIcon(healthStatus), [healthStatus]);
  const count = useMemo<number>(
    () => instances.filter((instance) => instance.health.status === healthStatus).length,
    [instances, healthStatus]
  );
  const percentage = useMemo<string>(
    () => (instances.length > 0 ? (count / instances.length) * 100 : 0).toFixed(0),
    [count, instances]
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
        <Stack direction={'row'} spacing={1} justifyContent={'space-between'} alignItems={'center'}>
          <Box sx={{ overflow: 'hidden' }}>
            <Typography variant={'subtitle2'} component={'div'} noWrap sx={{ color: 'text.secondary' }}>
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
export default ApplicationInstancesHealthStatusWidget;
