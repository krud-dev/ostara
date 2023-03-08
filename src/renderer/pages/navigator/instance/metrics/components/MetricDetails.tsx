import React, { useCallback, useEffect, useMemo, useState } from 'react';
import TableDetailsLabelValue from 'renderer/components/table/details/TableDetailsLabelValue';
import { FormattedMessage } from 'react-intl';
import { Box, Card, CardContent, CardHeader, Chip, CircularProgress, Stack } from '@mui/material';
import { COMPONENTS_SPACING, DEFAULT_TABLE_COLUMN_WIDTH } from 'renderer/constants/ui';
import { EnrichedInstanceMetric } from '../../../../../apis/requests/instance/metrics/getInstanceMetrics';
import { useGetInstanceMetricDetailsQuery } from '../../../../../apis/requests/instance/metrics/getInstanceMetricDetails';
import { isNil } from 'lodash';
import { MetricActuatorResponse } from '../../../../../../common/generated_definitions';

type MetricDetailsProps = {
  row: EnrichedInstanceMetric;
};

export default function MetricDetails({ row }: MetricDetailsProps) {
  const [metricDetails, setMetricDetails] = useState<MetricActuatorResponse | undefined>(undefined);
  const [selectedTags, setSelectedTags] = useState<{ [key: string]: string }>({});

  const detailsState = useGetInstanceMetricDetailsQuery({
    instanceId: row.instanceId,
    name: row.name,
    tags: selectedTags,
  });

  useEffect(() => {
    if (!metricDetails) {
      const result = detailsState.data;
      if (result) {
        setMetricDetails(result);
      }
    }
  }, [detailsState.data]);

  const toggleTagHandler = useCallback(
    (tag: string, value: string): void => {
      setSelectedTags((prev) => {
        const newSelectedTags = { ...prev };
        if (newSelectedTags[tag] === value) {
          delete newSelectedTags[tag];
        } else {
          newSelectedTags[tag] = value;
        }
        return newSelectedTags;
      });
    },
    [setSelectedTags]
  );

  const showMeasurements = useMemo<boolean>(() => !!metricDetails?.measurements?.length, [metricDetails]);
  const showTags = useMemo<boolean>(() => !!metricDetails?.availableTags?.length, [metricDetails]);

  return (
    <Box sx={{ my: 2 }}>
      {!metricDetails ? (
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
                value={metricDetails.description}
              />
              <TableDetailsLabelValue label={<FormattedMessage id={'baseUnit'} />} value={metricDetails.baseUnit} />
            </CardContent>
          </Card>

          {showMeasurements && (
            <Card variant={'outlined'}>
              <CardHeader title={<FormattedMessage id={'measurements'} />} />
              <CardContent
                sx={{
                  display: 'grid',
                  gridTemplateColumns: `repeat(auto-fit, minmax(${DEFAULT_TABLE_COLUMN_WIDTH}px, 1fr))`,
                  gridGap: (theme) => theme.spacing(1),
                }}
              >
                {metricDetails.measurements.map((measurement) => (
                  <TableDetailsLabelValue
                    label={measurement.statistic}
                    value={detailsState.data?.measurements.find((m) => m.statistic === measurement.statistic)?.value}
                    key={measurement.statistic}
                  />
                ))}
              </CardContent>
            </Card>
          )}

          {showTags && (
            <Card variant={'outlined'}>
              <CardHeader title={<FormattedMessage id={'tags'} />} />
              <CardContent>
                {metricDetails.availableTags.map((tagDetails) => (
                  <TableDetailsLabelValue
                    label={tagDetails.tag}
                    value={
                      <Box sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: 1, mt: 0.5 }}>
                        {tagDetails.values.map((value) => {
                          const tagValue = selectedTags[tagDetails.tag];
                          const selected = tagValue === value;
                          const disabled =
                            !selected &&
                            ((!isNil(tagValue) && tagValue !== value) ||
                              !detailsState.data?.availableTags
                                ?.find((tag) => tag.tag === tagDetails.tag)
                                ?.values.includes(value));
                          return (
                            <Chip
                              label={value}
                              size={'small'}
                              color={selected ? 'primary' : 'default'}
                              disabled={disabled}
                              onClick={() => toggleTagHandler(tagDetails.tag, value)}
                              key={value}
                            />
                          );
                        })}
                      </Box>
                    }
                    sx={{ mt: 1.5 }}
                  />
                ))}
              </CardContent>
            </Card>
          )}
        </Stack>
      )}
    </Box>
  );
}
