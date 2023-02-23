import React, { useMemo } from 'react';
import TableDetailsLabelValue from 'renderer/components/table/details/TableDetailsLabelValue';
import { FormattedMessage } from 'react-intl';
import { Box, Card, CardContent, CardHeader, CircularProgress, Stack } from '@mui/material';
import { COMPONENTS_SPACING, DEFAULT_TABLE_COLUMN_WIDTH } from 'renderer/constants/ui';
import { EnrichedQuartzJob } from '../../../../../apis/requests/instance/quartz/getInstanceQuartzJobs';
import { useGetInstanceQuartzJobDetailsQuery } from '../../../../../apis/requests/instance/quartz/getInstanceQuartzJobDetails';
import { isObject, map, toString } from 'lodash';
import FormattedRelativeTimeNow from '../../../../../components/format/FormattedRelativeTimeNow';
import FormattedBoolean from '../../../../../components/format/FormattedBoolean';

type QuartzJobDetailsProps = {
  row: EnrichedQuartzJob;
};

export default function QuartzJobDetails({ row }: QuartzJobDetailsProps) {
  const detailsState = useGetInstanceQuartzJobDetailsQuery({
    instanceId: row.instanceId,
    name: row.name,
    group: row.group,
  });

  const showDataCard = useMemo<boolean>(
    () => Object.keys(detailsState.data?.data || {}).length > 0,
    [detailsState.data]
  );

  const showTriggersCard = useMemo<boolean>(() => !!detailsState.data?.triggers.length, [detailsState.data]);

  return (
    <Box sx={{ my: 2 }}>
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
                label={<FormattedMessage id={'className'} />}
                value={detailsState.data.className}
              />
              <TableDetailsLabelValue
                label={<FormattedMessage id={'durable'} />}
                value={<FormattedBoolean value={detailsState.data.durable} />}
              />
              <TableDetailsLabelValue
                label={<FormattedMessage id={'requestRecovery'} />}
                value={<FormattedBoolean value={detailsState.data.requestRecovery} />}
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

          {showTriggersCard && (
            <Card variant={'outlined'}>
              <CardHeader title={<FormattedMessage id={'triggers'} />} />
              {detailsState.data.triggers.map((trigger) => (
                <CardContent
                  key={trigger.name}
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: `repeat(auto-fit, minmax(${DEFAULT_TABLE_COLUMN_WIDTH}px, 1fr))`,
                    gridGap: (theme) => theme.spacing(1),
                  }}
                >
                  <TableDetailsLabelValue
                    label={<FormattedMessage id={'name'} />}
                    value={<FormattedMessage id={trigger.name} />}
                  />
                  <TableDetailsLabelValue label={<FormattedMessage id={'priority'} />} value={trigger.priority} />
                  <TableDetailsLabelValue
                    label={<FormattedMessage id={'previousFireTime'} />}
                    value={
                      !!trigger.previousFireTime && (
                        <FormattedRelativeTimeNow value={trigger.previousFireTime} updateIntervalInSeconds={0} />
                      )
                    }
                  />
                  <TableDetailsLabelValue
                    label={<FormattedMessage id={'nextFireTime'} />}
                    value={
                      !!trigger.nextFireTime && (
                        <FormattedRelativeTimeNow value={trigger.nextFireTime} updateIntervalInSeconds={0} />
                      )
                    }
                  />
                </CardContent>
              ))}
            </Card>
          )}
        </Stack>
      )}
    </Box>
  );
}
