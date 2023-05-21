import React, { useMemo } from 'react';
import DetailsLabelValueVertical from 'renderer/components/table/details/DetailsLabelValueVertical';
import { FormattedMessage } from 'react-intl';
import { Box, Card, CardContent, CardHeader, Stack } from '@mui/material';
import { COMPONENTS_SPACING, DEFAULT_TABLE_COLUMN_WIDTH } from 'renderer/constants/ui';
import { isEmpty, map } from 'lodash';
import { EnrichedTogglzFeature } from '../../../../../apis/requests/instance/togglz/getInstanceTogglz';

type TogglzDetailsProps = {
  row: EnrichedTogglzFeature;
};

export default function TogglzDetails({ row }: TogglzDetailsProps) {
  const showAttributes = useMemo<boolean>(() => !isEmpty(row.metadata?.attributes), [row]);

  return (
    <Box sx={{ my: 2 }}>
      <Stack direction={'column'} spacing={COMPONENTS_SPACING}>
        <Card variant={'outlined'}>
          <CardHeader title={<FormattedMessage id={'parameters'} />} />
          <CardContent
            sx={{
              display: 'grid',
              gridTemplateColumns: `repeat(auto-fit, minmax(${DEFAULT_TABLE_COLUMN_WIDTH}px, 1fr))`,
              gridGap: (theme) => theme.spacing(1),
            }}
          >
            <DetailsLabelValueVertical
              label={<FormattedMessage id={'strategy'} />}
              value={row.strategy || <FormattedMessage id={'none'} />}
            />
            {map(row.params, (value, key) => (
              <DetailsLabelValueVertical label={key} value={value} key={key} />
            ))}
          </CardContent>
        </Card>

        {showAttributes && (
          <Card variant={'outlined'}>
            <CardHeader title={<FormattedMessage id={'attributes'} />} />
            <CardContent
              sx={{
                display: 'grid',
                gridTemplateColumns: `repeat(auto-fit, minmax(${DEFAULT_TABLE_COLUMN_WIDTH}px, 1fr))`,
                gridGap: (theme) => theme.spacing(1),
              }}
            >
              {map(row.metadata?.attributes, (value, key) => (
                <DetailsLabelValueVertical label={key} value={value} key={key} />
              ))}
            </CardContent>
          </Card>
        )}
      </Stack>
    </Box>
  );
}
