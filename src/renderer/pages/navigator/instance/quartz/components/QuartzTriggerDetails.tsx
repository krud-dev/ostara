import React, { useMemo } from 'react';
import TableDetailsLabelValue from 'renderer/components/table/details/TableDetailsLabelValue';
import { FormattedMessage } from 'react-intl';
import { Box, Card, CardContent, CardHeader, CircularProgress, Stack, Tooltip } from '@mui/material';
import { COMPONENTS_SPACING, DEFAULT_TABLE_COLUMN_WIDTH } from 'renderer/constants/ui';
import { isObject, map, toString } from 'lodash';
import FormattedRelativeTimeNow from '../../../../../components/format/FormattedRelativeTimeNow';
import { EnrichedQuartzTrigger } from '../../../../../apis/requests/instance/quartz/getInstanceQuartzTriggers';
import { useGetInstanceQuartzTriggerDetailsQuery } from '../../../../../apis/requests/instance/quartz/getInstanceQuartzTriggerDetails';
import FormattedDateAndRelativeTime from '../../../../../components/format/FormattedDateAndRelativeTime';
import Label, { LabelColor } from '../../../../../components/common/Label';
import FormattedBoolean from '../../../../../components/format/FormattedBoolean';
import FormattedCron from '../../../../../components/format/FormattedCron';
import FormattedInterval from '../../../../../components/format/FormattedInterval';
import { SxProps } from '@mui/system';
import { Theme } from '@mui/material/styles';

type QuartzTriggerDetailsProps = {
  row: EnrichedQuartzTrigger;
  sx?: SxProps<Theme>;
};

export default function QuartzTriggerDetails({ row, sx }: QuartzTriggerDetailsProps) {
  const detailsState = useGetInstanceQuartzTriggerDetailsQuery({
    instanceId: row.instanceId,
    name: row.name,
    group: row.group,
  });

  const showDataCard = useMemo<boolean>(
    () => Object.keys(detailsState.data?.data || {}).length > 0,
    [detailsState.data]
  );

  const stateColor = useMemo<LabelColor>(() => {
    if (!detailsState.data?.state) {
      return 'default';
    }
    switch (detailsState.data.state) {
      case 'BLOCKED':
        return 'error';
      case 'COMPLETE':
        return 'success';
      case 'ERROR':
        return 'error';
      case 'NONE':
        return 'default';
      case 'NORMAL':
        return 'info';
      case 'PAUSED':
        return 'warning';
      default:
        return 'default';
    }
  }, [detailsState.data]);

  return (
    <Box sx={{ my: 2, ...sx }}>
      {!detailsState.data ? (
        <Box sx={{ textAlign: 'center' }}>
          <CircularProgress />
        </Box>
      ) : (
        <Stack direction={'column'} spacing={COMPONENTS_SPACING}>
          <Card variant={'outlined'}>
            <CardHeader title={<FormattedMessage id={'details'} />} />
            <CardContent
              sx={{
                display: 'grid',
                gridTemplateColumns: `repeat(auto-fit, minmax(${DEFAULT_TABLE_COLUMN_WIDTH}px, 1fr))`,
                gridGap: (theme) => theme.spacing(1),
              }}
            >
              <TableDetailsLabelValue
                label={<FormattedMessage id={'description'} />}
                value={detailsState.data.description}
              />
              <TableDetailsLabelValue
                label={<FormattedMessage id={'state'} />}
                value={<Label color={stateColor}>{detailsState.data.state}</Label>}
              />
              <TableDetailsLabelValue
                label={<FormattedMessage id={'type'} />}
                value={<Label color={'default'}>{detailsState.data.type}</Label>}
              />
              <TableDetailsLabelValue label={<FormattedMessage id={'priority'} />} value={detailsState.data.priority} />
              <TableDetailsLabelValue
                label={<FormattedMessage id={'previousFireTime'} />}
                value={
                  !!detailsState.data.previousFireTime && (
                    <FormattedRelativeTimeNow value={detailsState.data.previousFireTime} updateIntervalInSeconds={0} />
                  )
                }
              />
              <TableDetailsLabelValue
                label={<FormattedMessage id={'nextFireTime'} />}
                value={
                  !!detailsState.data.nextFireTime && (
                    <FormattedRelativeTimeNow value={detailsState.data.nextFireTime} updateIntervalInSeconds={0} />
                  )
                }
              />
              <TableDetailsLabelValue
                label={<FormattedMessage id={'finalFireTime'} />}
                value={
                  !!detailsState.data.finalFireTime && (
                    <FormattedDateAndRelativeTime value={detailsState.data.finalFireTime} updateIntervalInSeconds={0} />
                  )
                }
              />
              <TableDetailsLabelValue
                label={<FormattedMessage id={'startTime'} />}
                value={
                  !!detailsState.data.startTime && (
                    <FormattedDateAndRelativeTime value={detailsState.data.startTime} showRelative={false} />
                  )
                }
              />
              <TableDetailsLabelValue
                label={<FormattedMessage id={'endTime'} />}
                value={
                  !!detailsState.data.endTime && (
                    <FormattedDateAndRelativeTime value={detailsState.data.endTime} showRelative={false} />
                  )
                }
              />
              <TableDetailsLabelValue
                label={<FormattedMessage id={'calendarName'} />}
                value={detailsState.data.calendarName}
              />
            </CardContent>
          </Card>

          {showDataCard && (
            <Card variant={'outlined'}>
              <CardHeader title={<FormattedMessage id={'data'} />} />
              <CardContent
                sx={{
                  display: 'grid',
                  gridTemplateColumns: `repeat(auto-fit, minmax(${DEFAULT_TABLE_COLUMN_WIDTH}px, 1fr))`,
                  gridGap: (theme) => theme.spacing(1),
                }}
              >
                {map(detailsState.data.data, (value, key) => (
                  <TableDetailsLabelValue
                    key={key}
                    label={key}
                    value={isObject(value) ? JSON.stringify(value) : toString(value)}
                  />
                ))}
              </CardContent>
            </Card>
          )}

          {detailsState.data.calendarInterval && (
            <Card variant={'outlined'}>
              <CardHeader title={<FormattedMessage id={'calendarInterval'} />} />
              <CardContent
                sx={{
                  display: 'grid',
                  gridTemplateColumns: `repeat(auto-fit, minmax(${DEFAULT_TABLE_COLUMN_WIDTH}px, 1fr))`,
                  gridGap: (theme) => theme.spacing(1),
                }}
              >
                <TableDetailsLabelValue
                  label={<FormattedMessage id={'interval'} />}
                  value={<FormattedInterval value={detailsState.data.calendarInterval.interval} />}
                />
                <TableDetailsLabelValue
                  label={<FormattedMessage id={'timeZone'} />}
                  value={detailsState.data.calendarInterval.timeZone}
                />
                <TableDetailsLabelValue
                  label={<FormattedMessage id={'preserveHourOfDayAcrossDaylightSavings'} />}
                  value={
                    <FormattedBoolean
                      value={detailsState.data.calendarInterval.preserveHourOfDayAcrossDaylightSavings}
                    />
                  }
                />
                <TableDetailsLabelValue
                  label={<FormattedMessage id={'skipDayIfHourDoesNotExist'} />}
                  value={<FormattedBoolean value={detailsState.data.calendarInterval.skipDayIfHourDoesNotExist} />}
                />
                <TableDetailsLabelValue
                  label={<FormattedMessage id={'timesTriggered'} />}
                  value={detailsState.data.calendarInterval.timesTriggered}
                />
              </CardContent>
            </Card>
          )}

          {detailsState.data.custom && (
            <Card variant={'outlined'}>
              <CardHeader title={<FormattedMessage id={'custom'} />} />
              <CardContent
                sx={{
                  display: 'grid',
                  gridTemplateColumns: `repeat(auto-fit, minmax(${DEFAULT_TABLE_COLUMN_WIDTH}px, 1fr))`,
                  gridGap: (theme) => theme.spacing(1),
                }}
              >
                <TableDetailsLabelValue
                  label={<FormattedMessage id={'trigger'} />}
                  value={detailsState.data.custom.trigger}
                />
              </CardContent>
            </Card>
          )}

          {detailsState.data.cron && (
            <Card variant={'outlined'}>
              <CardHeader title={<FormattedMessage id={'cron'} />} />
              <CardContent
                sx={{
                  display: 'grid',
                  gridTemplateColumns: `repeat(auto-fit, minmax(${DEFAULT_TABLE_COLUMN_WIDTH}px, 1fr))`,
                  gridGap: (theme) => theme.spacing(1),
                }}
              >
                <TableDetailsLabelValue
                  label={<FormattedMessage id={'expression'} />}
                  value={
                    <Tooltip title={detailsState.data.cron.expression}>
                      <span>
                        <FormattedCron value={detailsState.data.cron.expression} />
                      </span>
                    </Tooltip>
                  }
                />
                <TableDetailsLabelValue
                  label={<FormattedMessage id={'timeZone'} />}
                  value={detailsState.data.cron.timeZone}
                />
              </CardContent>
            </Card>
          )}

          {detailsState.data.dailyTimeInterval && (
            <Card variant={'outlined'}>
              <CardHeader title={<FormattedMessage id={'dailyTimeInterval'} />} />
              <CardContent
                sx={{
                  display: 'grid',
                  gridTemplateColumns: `repeat(auto-fit, minmax(${DEFAULT_TABLE_COLUMN_WIDTH}px, 1fr))`,
                  gridGap: (theme) => theme.spacing(1),
                }}
              >
                <TableDetailsLabelValue
                  label={<FormattedMessage id={'daysOfWeek'} />}
                  value={detailsState.data.dailyTimeInterval.daysOfWeek.join(', ')}
                />
                <TableDetailsLabelValue
                  label={<FormattedMessage id={'startTimeOfDay'} />}
                  value={detailsState.data.dailyTimeInterval.startTimeOfDay}
                />
                <TableDetailsLabelValue
                  label={<FormattedMessage id={'endTimeOfDay'} />}
                  value={detailsState.data.dailyTimeInterval.endTimeOfDay}
                />
                <TableDetailsLabelValue
                  label={<FormattedMessage id={'interval'} />}
                  value={<FormattedInterval value={detailsState.data.dailyTimeInterval.interval} />}
                />
                <TableDetailsLabelValue
                  label={<FormattedMessage id={'repeatCount'} />}
                  value={detailsState.data.dailyTimeInterval.repeatCount}
                />
                <TableDetailsLabelValue
                  label={<FormattedMessage id={'timesTriggered'} />}
                  value={detailsState.data.dailyTimeInterval.timesTriggered}
                />
              </CardContent>
            </Card>
          )}

          {detailsState.data.simple && (
            <Card variant={'outlined'}>
              <CardHeader title={<FormattedMessage id={'simple'} />} />
              <CardContent
                sx={{
                  display: 'grid',
                  gridTemplateColumns: `repeat(auto-fit, minmax(${DEFAULT_TABLE_COLUMN_WIDTH}px, 1fr))`,
                  gridGap: (theme) => theme.spacing(1),
                }}
              >
                <TableDetailsLabelValue
                  label={<FormattedMessage id={'interval'} />}
                  value={<FormattedInterval value={detailsState.data.simple.interval} />}
                />
                <TableDetailsLabelValue
                  label={<FormattedMessage id={'repeatCount'} />}
                  value={detailsState.data.simple.repeatCount}
                />
                <TableDetailsLabelValue
                  label={<FormattedMessage id={'timesTriggered'} />}
                  value={detailsState.data.simple.timesTriggered}
                />
              </CardContent>
            </Card>
          )}
        </Stack>
      )}
    </Box>
  );
}
