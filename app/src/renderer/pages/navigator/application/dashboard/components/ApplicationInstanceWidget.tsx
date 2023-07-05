import React, { FunctionComponent, useCallback, useMemo } from 'react';
import { Card, CardContent, Stack, Tooltip, Typography } from '@mui/material';
import { FormattedMessage } from 'react-intl';
import { InstanceRO } from 'common/generated_definitions';
import {
  getInstanceHealthStatusColor,
  getInstanceHealthStatusIcon,
  getInstanceHealthStatusTextId,
  getItemDisplayName,
  getItemUrl,
  getItemVersion,
} from 'renderer/utils/itemUtils';
import { IconViewer, MUIconType } from 'renderer/components/common/IconViewer';
import FormattedRelativeTimeNow from 'renderer/components/format/FormattedRelativeTimeNow';
import { useNavigate } from 'react-router-dom';
import useItemIcon from 'renderer/hooks/items/useItemIcon';
import useItemColor from 'renderer/hooks/items/useItemColor';
import { useNavigatorLayoutContext } from 'renderer/contexts/NavigatorLayoutContext';

type ApplicationInstanceWidgetProps = {
  instance: InstanceRO;
};

const ApplicationInstanceWidget: FunctionComponent<ApplicationInstanceWidgetProps> = ({ instance }) => {
  const { data } = useNavigatorLayoutContext();
  const navigate = useNavigate();

  const title = useMemo<string>(() => getItemDisplayName(instance), [instance]);
  const healthStatusColor = useMemo<string>(
    () => getInstanceHealthStatusColor(instance.health.status) || 'transparent',
    [instance]
  );
  const healthStatusIcon = useMemo<MUIconType>(() => getInstanceHealthStatusIcon(instance.health.status), [instance]);
  const healthStatusTextId = useMemo<string>(
    () => getInstanceHealthStatusTextId(instance.health.status) || 'notAvailable',
    [instance]
  );
  const icon = useItemIcon(instance);
  const color = useItemColor(instance, data);

  const cardClickHandler = useCallback((): void => {
    navigate(getItemUrl(instance));
  }, [instance]);

  const version = useMemo<string | undefined>(() => getItemVersion(instance), [instance]);

  return (
    <Card
      variant={'outlined'}
      onClick={cardClickHandler}
      sx={{
        height: '100%',
        borderColor: healthStatusColor,
        transition: 'border-color 0.5s',
        cursor: 'pointer',
      }}
    >
      <CardContent sx={{ overflow: 'hidden' }}>
        <Stack direction={'row'} spacing={0.5} alignItems={'center'}>
          <IconViewer icon={healthStatusIcon} fontSize={'small'} sx={{ color: healthStatusColor }} />
          <Typography variant={'subtitle2'} noWrap sx={{ color: 'text.secondary' }}>
            <Typography variant={'inherit'} component={'span'} sx={{ color: healthStatusColor }}>
              <FormattedMessage id={healthStatusTextId} />
            </Typography>

            {version && (
              <Tooltip title={<FormattedMessage id={'version'} />}>
                <Typography variant={'body2'} component={'span'}>
                  {` (${version})`}
                </Typography>
              </Tooltip>
            )}
          </Typography>
        </Stack>

        <Stack direction={'row'} spacing={0.75} alignItems={'center'}>
          <IconViewer icon={icon} fontSize={'medium'} sx={{ color }} />
          <Typography variant={'h4'} component={'div'} noWrap sx={{ lineHeight: 1.4 }}>
            <Tooltip title={title}>
              <span>{title}</span>
            </Tooltip>
          </Typography>
        </Stack>

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
