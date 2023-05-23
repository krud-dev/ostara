import React, { useMemo } from 'react';
import DetailsLabelValueVertical from 'renderer/components/table/details/DetailsLabelValueVertical';
import { FormattedMessage } from 'react-intl';
import { Box, Card, CardContent, CardHeader, Stack, Tooltip } from '@mui/material';
import { COMPONENTS_SPACING, DEFAULT_TABLE_COLUMN_WIDTH } from 'renderer/constants/ui';
import { isObject, map, toString } from 'lodash';
import { EnrichedQuartzTrigger } from '../../../../../apis/requests/instance/quartz/getInstanceQuartzTriggers';
import { useGetInstanceQuartzTriggerDetailsQuery } from '../../../../../apis/requests/instance/quartz/getInstanceQuartzTriggerDetails';
import Label, { LabelColor } from '../../../../../components/common/Label';
import FormattedBoolean from '../../../../../components/format/FormattedBoolean';
import FormattedCron from '../../../../../components/format/FormattedCron';
import FormattedInterval from '../../../../../components/format/FormattedInterval';
import { SxProps } from '@mui/system';
import { Theme } from '@mui/material/styles';
import FormattedParsedDate from '../../../../../components/format/FormattedParsedDate';
import LogoLoader from '../../../../../components/common/LogoLoader';

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
          <LogoLoader />
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
              <DetailsLabelValueVertical
                label={<FormattedMessage id={'description'} />}
                value={detailsState.data.description}
              />
              <DetailsLabelValueVertical
                label={<FormattedMessage id={'state'} />}
                value={<Label color={stateColor}>{detailsState.data.state}</Label>}
              />
              <DetailsLabelValueVertical
                label={<FormattedMessage id={'type'} />}
                value={<Label color={'default'}>{detailsState.data.type}</Label>}
              />
              <DetailsLabelValueVertical
                label={<FormattedMessage id={'priority'} />}
                value={detailsState.data.priority}
              />
              <DetailsLabelValueVertical
                label={<FormattedMessage id={'previousFireTime'} />}
                value={
                  !!detailsState.data.previousFireTime && (
                    <FormattedParsedDate
                      value={detailsState.data.previousFireTime}
                      showRelative
                      updateIntervalInSeconds={0}
                    />
                  )
                }
              />
              <DetailsLabelValueVertical
                label={<FormattedMessage id={'nextFireTime'} />}
                value={
                  !!detailsState.data.nextFireTime && (
                    <FormattedParsedDate
                      value={detailsState.data.nextFireTime}
                      showRelative
                      updateIntervalInSeconds={0}
                    />
                  )
                }
              />
              <DetailsLabelValueVertical
                label={<FormattedMessage id={'finalFireTime'} />}
                value={
                  !!detailsState.data.finalFireTime && (
                    <FormattedParsedDate
                      value={detailsState.data.finalFireTime}
                      showRelative
                      updateIntervalInSeconds={0}
                    />
                  )
                }
              />
              <DetailsLabelValueVertical
                label={<FormattedMessage id={'startTime'} />}
                value={!!detailsState.data.startTime && <FormattedParsedDate value={detailsState.data.startTime} />}
              />
              <DetailsLabelValueVertical
                label={<FormattedMessage id={'endTime'} />}
                value={!!detailsState.data.endTime && <FormattedParsedDate value={detailsState.data.endTime} />}
              />
              <DetailsLabelValueVertical
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
                  <DetailsLabelValueVertical
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
                <DetailsLabelValueVertical
                  label={<FormattedMessage id={'interval'} />}
                  value={<FormattedInterval value={detailsState.data.calendarInterval.interval} />}
                />
                <DetailsLabelValueVertical
                  label={<FormattedMessage id={'timeZone'} />}
                  value={detailsState.data.calendarInterval.timeZone}
                />
                <DetailsLabelValueVertical
                  label={<FormattedMessage id={'preserveHourOfDayAcrossDaylightSavings'} />}
                  value={
                    <FormattedBoolean
                      value={detailsState.data.calendarInterval.preserveHourOfDayAcrossDaylightSavings}
                    />
                  }
                />
                <DetailsLabelValueVertical
                  label={<FormattedMessage id={'skipDayIfHourDoesNotExist'} />}
                  value={<FormattedBoolean value={detailsState.data.calendarInterval.skipDayIfHourDoesNotExist} />}
                />
                <DetailsLabelValueVertical
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
                <DetailsLabelValueVertical
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
                <DetailsLabelValueVertical
                  label={<FormattedMessage id={'expression'} />}
                  value={
                    <Tooltip title={detailsState.data.cron.expression}>
                      <span>
                        <FormattedCron value={detailsState.data.cron.expression} />
                      </span>
                    </Tooltip>
                  }
                />
                <DetailsLabelValueVertical
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
                <DetailsLabelValueVertical
                  label={<FormattedMessage id={'daysOfWeek'} />}
                  value={detailsState.data.dailyTimeInterval.daysOfWeek.join(', ')}
                />
                <DetailsLabelValueVertical
                  label={<FormattedMessage id={'startTimeOfDay'} />}
                  value={detailsState.data.dailyTimeInterval.startTimeOfDay}
                />
                <DetailsLabelValueVertical
                  label={<FormattedMessage id={'endTimeOfDay'} />}
                  value={detailsState.data.dailyTimeInterval.endTimeOfDay}
                />
                <DetailsLabelValueVertical
                  label={<FormattedMessage id={'interval'} />}
                  value={<FormattedInterval value={detailsState.data.dailyTimeInterval.interval} />}
                />
                <DetailsLabelValueVertical
                  label={<FormattedMessage id={'repeatCount'} />}
                  value={detailsState.data.dailyTimeInterval.repeatCount}
                />
                <DetailsLabelValueVertical
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
                <DetailsLabelValueVertical
                  label={<FormattedMessage id={'interval'} />}
                  value={<FormattedInterval value={detailsState.data.simple.interval} />}
                />
                <DetailsLabelValueVertical
                  label={<FormattedMessage id={'repeatCount'} />}
                  value={detailsState.data.simple.repeatCount}
                />
                <DetailsLabelValueVertical
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
