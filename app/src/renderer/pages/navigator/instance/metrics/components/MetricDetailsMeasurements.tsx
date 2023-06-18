import React, { useMemo } from 'react';
import DetailsLabelValueVertical from 'renderer/components/table/details/DetailsLabelValueVertical';
import { FormattedMessage, useIntl } from 'react-intl';
import { Box, Card, CardContent, CardHeader, Tooltip } from '@mui/material';
import { DEFAULT_TABLE_COLUMN_WIDTH } from 'renderer/constants/ui';
import { MetricActuatorResponse } from 'common/generated_definitions';
import { formatWidgetValue } from 'renderer/utils/formatUtils';

type MetricDetailsMeasurementsProps = {
  metricDetails: MetricActuatorResponse;
};

export default function MetricDetailsMeasurements({ metricDetails }: MetricDetailsMeasurementsProps) {
  const intl = useIntl();

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
        {metricDetails.measurements.map((measurement) => {
          const value = metricDetails.measurements.find((m) => m.statistic === measurement.statistic)?.value;
          const formattedValue = formatWidgetValue(value, metricDetails.baseUnit, intl);
          return (
            <DetailsLabelValueVertical
              label={measurement.statistic}
              value={
                <Tooltip title={value}>
                  <Box component={'span'}>{formattedValue}</Box>
                </Tooltip>
              }
              key={measurement.statistic}
            />
          );
        })}
      </CardContent>
    </Card>
  );
}
