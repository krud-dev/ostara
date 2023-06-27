import React, { FunctionComponent, useCallback, useMemo } from 'react';
import { Card, CardContent, Stack, Tooltip, Typography } from '@mui/material';
import { FormattedMessage } from 'react-intl';
import { ApplicationRO } from 'common/generated_definitions';
import {
  getApplicationHealthStatusColor,
  getApplicationHealthStatusIcon,
  getApplicationHealthStatusTextId,
  getItemDisplayName,
  getItemUrl,
} from 'renderer/utils/itemUtils';
import { IconViewer, MUIconType } from 'renderer/components/common/IconViewer';
import FormattedRelativeTimeNow from 'renderer/components/format/FormattedRelativeTimeNow';
import { useNavigate } from 'react-router-dom';
import useItemIcon from 'renderer/hooks/useItemIcon';
import useItemColor from 'renderer/hooks/useItemColor';
import { useItemsContext } from 'renderer/contexts/ItemsContext';
import { useNavigatorLayoutContext } from 'renderer/contexts/NavigatorLayoutContext';

type FolderApplicationWidgetProps = {
  application: ApplicationRO;
};

const FolderApplicationWidget: FunctionComponent<FolderApplicationWidgetProps> = ({ application }) => {
  const { instances } = useItemsContext();
  const { data } = useNavigatorLayoutContext();
  const navigate = useNavigate();

  const title = useMemo<string>(() => getItemDisplayName(application), [application]);
  const healthStatusColor = useMemo<string>(
    () => getApplicationHealthStatusColor(application.health.status) || 'transparent',
    [application]
  );
  const healthStatusIcon = useMemo<MUIconType>(
    () => getApplicationHealthStatusIcon(application.health.status),
    [application]
  );
  const healthStatusTextId = useMemo<string>(
    () => getApplicationHealthStatusTextId(application.health.status) || 'notAvailable',
    [application]
  );
  const icon = useItemIcon(application);
  const color = useItemColor(application, data);
  const instancesCount = useMemo<number>(
    () => instances?.filter((instance) => instance.parentApplicationId === application.id).length || 0,
    [instances, application]
  );

  const cardClickHandler = useCallback((): void => {
    navigate(getItemUrl(application));
  }, [application]);

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
          <Typography variant={'subtitle2'} component={'div'} sx={{ color: healthStatusColor }}>
            <FormattedMessage id={healthStatusTextId} />
          </Typography>
        </Stack>

        <Stack direction={'row'} spacing={0.75} alignItems={'center'}>
          <IconViewer icon={icon} fontSize={'medium'} sx={{ color }} />
          <Typography variant={'h4'} component={'div'} noWrap sx={{ lineHeight: 1.4 }}>
            <Tooltip title={title}>
              <span>{title}</span>
            </Tooltip>{' '}
            <Tooltip title={<FormattedMessage id={'instances'} />}>
              <span>{`(${instancesCount})`}</span>
            </Tooltip>
          </Typography>
        </Stack>

        <Typography variant={'body2'} component={'div'} sx={{ color: 'text.secondary' }}>
          <Tooltip title={<FormattedMessage id={'lastStatusChangeTime'} />}>
            <span>
              <FormattedRelativeTimeNow value={application.health.lastStatusChangeTime} />
            </span>
          </Tooltip>
        </Typography>
      </CardContent>
    </Card>
  );
};
export default FolderApplicationWidget;
