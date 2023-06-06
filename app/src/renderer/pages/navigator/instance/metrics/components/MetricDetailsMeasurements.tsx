import React, { useMemo } from 'react';
import DetailsLabelValueVertical from 'renderer/components/table/details/DetailsLabelValueVertical';
import { FormattedMessage } from 'react-intl';
import { Card, CardContent, CardHeader } from '@mui/material';
import { DEFAULT_TABLE_COLUMN_WIDTH } from 'renderer/constants/ui';
import { MetricActuatorResponse } from '../../../../../../common/generated_definitions';

type MetricDetailsMeasurementsProps = {
  metricDetails: MetricActuatorResponse;
};

export default function MetricDetailsMeasurements({ metricDetails }: MetricDetailsMeasurementsProps) {
  const show = useMemo<boolean>(() => !!metricDetails?.measurements?.length, [metricDetails]);

  if (!show) {
    return null;
  }

  return (
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
          <DetailsLabelValueVertical
            label={measurement.statistic}
            value={metricDetails.measurements.find((m) => m.statistic === measurement.statistic)?.value}
            key={measurement.statistic}
          />
        ))}
      </CardContent>
    </Card>
  );
}
