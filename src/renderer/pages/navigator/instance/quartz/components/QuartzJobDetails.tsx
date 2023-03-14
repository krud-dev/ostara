import React, { useCallback, useMemo } from 'react';
import TableDetailsLabelValue from 'renderer/components/table/details/TableDetailsLabelValue';
import { FormattedMessage } from 'react-intl';
import { Box, Card, CardContent, CardHeader, Link, Stack } from '@mui/material';
import { COMPONENTS_SPACING, DEFAULT_TABLE_COLUMN_WIDTH } from 'renderer/constants/ui';
import { EnrichedQuartzJob } from '../../../../../apis/requests/instance/quartz/getInstanceQuartzJobs';
import { useGetInstanceQuartzJobDetailsQuery } from '../../../../../apis/requests/instance/quartz/getInstanceQuartzJobDetails';
import { isObject, map, toString } from 'lodash';
import FormattedBoolean from '../../../../../components/format/FormattedBoolean';
import { InlineCodeLabel } from '../../../../../components/code/InlineCodeLabel';
import NiceModal from '@ebay/nice-modal-react';
import QuartzTriggerDetailsDialog from './QuartzTriggerDetailsDialog';
import { EnrichedQuartzTrigger } from '../../../../../apis/requests/instance/quartz/getInstanceQuartzTriggers';
import FormattedParsedDate from '../../../../../components/format/FormattedParsedDate';
import LogoLoader from '../../../../../components/common/LogoLoader';

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

  const triggerClickHandler = useCallback(
    (event: React.MouseEvent, triggerName: string): void => {
      event.preventDefault();

      const trigger: EnrichedQuartzTrigger = {
        name: triggerName,
        group: row.group,
        instanceId: row.instanceId,
      };
      NiceModal.show<undefined>(QuartzTriggerDetailsDialog, {
        trigger: trigger,
      });
    },
    [row]
  );

  return (
    <Box sx={{ my: 2 }}>
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
              <TableDetailsLabelValue
                label={<FormattedMessage id={'description'} />}
                value={detailsState.data.description}
              />
              <TableDetailsLabelValue
                label={<FormattedMessage id={'className'} />}
                value={<InlineCodeLabel code={detailsState.data.className} />}
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
                    value={
                      <Link href={'#'} onClick={(e) => triggerClickHandler(e, trigger.name)}>
                        {trigger.name}
                      </Link>
                    }
                  />
                  <TableDetailsLabelValue label={<FormattedMessage id={'priority'} />} value={trigger.priority} />
                  <TableDetailsLabelValue
                    label={<FormattedMessage id={'previousFireTime'} />}
                    value={
                      !!trigger.previousFireTime && (
                        <FormattedParsedDate
                          value={trigger.previousFireTime}
                          showRelative
                          updateIntervalInSeconds={0}
                        />
                      )
                    }
                  />
                  <TableDetailsLabelValue
                    label={<FormattedMessage id={'nextFireTime'} />}
                    value={
                      !!trigger.nextFireTime && (
                        <FormattedParsedDate value={trigger.nextFireTime} showRelative updateIntervalInSeconds={0} />
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
