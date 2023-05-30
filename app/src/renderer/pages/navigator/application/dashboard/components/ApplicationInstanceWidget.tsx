import React, { FunctionComponent, useCallback, useMemo } from 'react';
import { Box, Card, CardContent, Stack, Tooltip, Typography } from '@mui/material';
import { FormattedMessage } from 'react-intl';
import { InstanceRO } from '../../../../../../common/generated_definitions';
import {
  getInstanceHealthStatusColor,
  getInstanceHealthStatusIcon,
  getInstanceHealthStatusTextId,
  getItemDisplayName,
  getItemUrl,
} from '../../../../../utils/itemUtils';
import { IconViewer, MUIconType } from '../../../../../components/common/IconViewer';
import FormattedDateAndRelativeTime from '../../../../../components/format/FormattedDateAndRelativeTime';
import FormattedRelativeTimeNow from '../../../../../components/format/FormattedRelativeTimeNow';
import { useNavigate } from 'react-router-dom';

type ApplicationInstanceWidgetProps = {
  instance: InstanceRO;
};

const ApplicationInstanceWidget: FunctionComponent<ApplicationInstanceWidgetProps> = ({ instance }) => {
  const navigate = useNavigate();

  const title = useMemo<string>(() => getItemDisplayName(instance), [instance]);
  const color = useMemo<string>(
    () => getInstanceHealthStatusColor(instance.health.status) || 'transparent',
    [instance]
  );
  const icon = useMemo<MUIconType>(() => getInstanceHealthStatusIcon(instance.health.status), [instance]);
  const healthStatusTextId = useMemo<string>(
    () => getInstanceHealthStatusTextId(instance.health.status) || 'notAvailable',
    [instance]
  );

  const cardClickHandler = useCallback((): void => {
    navigate(getItemUrl(instance));
  }, [instance]);

  return (
    <Card
      variant={'outlined'}
      onClick={cardClickHandler}
      sx={{
        height: '100%',
        borderColor: color,
        transition: 'border-color 0.5s',
        cursor: 'pointer',
      }}
    >
      <CardContent sx={{ overflow: 'hidden' }}>
        <Stack direction={'row'} spacing={0.5} alignItems={'center'}>
          <IconViewer icon={icon} fontSize={'small'} sx={{ color }} />
          <Typography variant={'subtitle2'} component={'div'} sx={{ color }}>
            <FormattedMessage id={healthStatusTextId} />
          </Typography>
        </Stack>

        <Typography variant={'h4'} component={'div'} noWrap sx={{ lineHeight: 1.4 }}>
          <Tooltip title={title}>
            <span>
              <FormattedMessage id={title} />
            </span>
          </Tooltip>
        </Typography>

        <Typography variant={'body2'} component={'div'} sx={{ color: 'text.secondary' }}>
          <Tooltip title={<FormattedMessage id={'lastStatusChangeTime'} />}>
            <span>
              <FormattedRelativeTimeNow value={instance.health.lastStatusChangeTime} />
            </span>
          </Tooltip>
        </Typography>
      </CardContent>
    </Card>
  );
};
export default ApplicationInstanceWidget;
