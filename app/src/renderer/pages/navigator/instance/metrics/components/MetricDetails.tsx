import React, { useCallback, useEffect, useState } from 'react';
import DetailsLabelValueVertical from 'renderer/components/table/details/DetailsLabelValueVertical';
import { FormattedMessage } from 'react-intl';
import { Box, Card, CardContent, CardHeader, Stack } from '@mui/material';
import { COMPONENTS_SPACING, DEFAULT_TABLE_COLUMN_WIDTH } from 'renderer/constants/ui';
import { EnrichedInstanceMetric } from '../../../../../apis/requests/instance/metrics/getInstanceMetrics';
import { useGetInstanceMetricDetailsQuery } from '../../../../../apis/requests/instance/metrics/getInstanceMetricDetails';
import { MetricActuatorResponse } from '../../../../../../common/generated_definitions';
import LogoLoader from '../../../../../components/common/LogoLoader';
import MetricDetailsMeasurements from './MetricDetailsMeasurements';
import MetricDetailsTags from './MetricDetailsTags';
import MetricDetailsRules from './MetricDetailsRules';

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

  return (
    <Box sx={{ my: 2 }}>
      {!metricDetails ? (
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
                value={metricDetails.description}
              />
              <DetailsLabelValueVertical label={<FormattedMessage id={'baseUnit'} />} value={metricDetails.baseUnit} />
            </CardContent>
          </Card>

          <MetricDetailsMeasurements metricDetails={metricDetails} />

          <MetricDetailsTags metricDetails={metricDetails} selectedTags={selectedTags} onToggleTag={toggleTagHandler} />

          <MetricDetailsRules metricDetails={metricDetails} />
        </Stack>
      )}
    </Box>
  );
}
