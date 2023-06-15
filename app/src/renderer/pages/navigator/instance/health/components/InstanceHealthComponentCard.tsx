import { Box, Card, CardContent, CardHeader, Stack } from '@mui/material';
import React, { useMemo } from 'react';
import DetailsLabelValueHorizontal from 'renderer/components/table/details/DetailsLabelValueHorizontal';
import { isObject, map, toString } from 'lodash';
import { EnrichedHealthActuatorResponse$Component } from 'renderer/pages/navigator/instance/health/index';
import { FormattedMessage, useIntl } from 'react-intl';
import { getInstanceHealthStatusColor, getInstanceHealthStatusTextId } from 'renderer/utils/itemUtils';
import {
  getInstanceHealthDetailsKeyFormatter,
  getInstanceHealthDetailsValueFormatter,
} from 'renderer/pages/navigator/instance/health/utils/instanceHealthDetailsFormatters';
import { splitCamelCase } from 'renderer/utils/formatUtils';

type InstanceHealthComponentCardProps = {
  component: EnrichedHealthActuatorResponse$Component;
};

export default function InstanceHealthComponentCard({ component }: InstanceHealthComponentCardProps) {
  const intl = useIntl();

  const title = useMemo<string>(() => {
    const keyFormatter = getInstanceHealthDetailsKeyFormatter(component.name);
    return keyFormatter(component.name, intl);
  }, [component]);
  const healthStatusColor = useMemo<string | undefined>(
    () => getInstanceHealthStatusColor(component.status),
    [component]
  );
  const healthTextId = useMemo<string | undefined>(() => getInstanceHealthStatusTextId(component.status), [component]);

  return (
    <Card>
      <CardHeader
        title={
          <Box component={'span'} sx={{ textTransform: 'capitalize' }}>
            {title}
          </Box>
        }
      />
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
          {map(component.details, (value, key) => {
            const fullKey = `${component.name}.${key}`;
            const valueFormatter = getInstanceHealthDetailsValueFormatter(fullKey);
            const formattedValue = valueFormatter(value, intl);
            const keyFormatter = getInstanceHealthDetailsKeyFormatter(fullKey);
            const formattedKey = keyFormatter(key, intl);

            return (
              <DetailsLabelValueHorizontal
                label={
                  <Box component={'span'} sx={{ textTransform: 'capitalize' }}>
                    {formattedKey}
                  </Box>
                }
                value={formattedValue}
                key={key}
              />
            );
          })}
        </Stack>
      </CardContent>
    </Card>
  );
}
