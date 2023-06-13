import { Box, Card, CardContent, CardHeader, Stack } from '@mui/material';
import React, { useMemo } from 'react';
import DetailsLabelValueHorizontal from 'renderer/components/table/details/DetailsLabelValueHorizontal';
import { isObject, map, toString } from 'lodash';
import { EnrichedHealthActuatorResponse$Component } from 'renderer/pages/navigator/instance/health/index';
import { FormattedMessage } from 'react-intl';
import { getInstanceHealthStatusColor, getInstanceHealthStatusTextId } from 'renderer/utils/itemUtils';

type InstanceHealthComponentCardProps = {
  component: EnrichedHealthActuatorResponse$Component;
};

export default function InstanceHealthComponentCard({ component }: InstanceHealthComponentCardProps) {
  const healthStatusColor = useMemo<string | undefined>(
    () => getInstanceHealthStatusColor(component.status),
    [component]
  );
  const healthTextId = useMemo<string | undefined>(() => getInstanceHealthStatusTextId(component.status), [component]);

  return (
    <Card>
      <CardHeader title={component.path} />
      <CardContent>
        <Stack direction={'column'} spacing={1}>
          <DetailsLabelValueHorizontal
            label={<FormattedMessage id={'status'} />}
            value={
              <Box component={'span'} sx={{ color: healthStatusColor }}>
                <FormattedMessage id={healthTextId} />
              </Box>
            }
          />
          {map(component.details, (value, key) => (
            <DetailsLabelValueHorizontal
              label={key}
              value={isObject(value) ? JSON.stringify(value) : toString(value)}
              key={key}
            />
          ))}
        </Stack>
      </CardContent>
    </Card>
  );
}
