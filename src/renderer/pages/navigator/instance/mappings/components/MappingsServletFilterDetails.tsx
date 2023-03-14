import React from 'react';
import TableDetailsLabelValue from 'renderer/components/table/details/TableDetailsLabelValue';
import { FormattedMessage } from 'react-intl';
import { Box, Card, CardContent, Stack } from '@mui/material';
import { COMPONENTS_SPACING } from 'renderer/constants/ui';
import { InlineCodeLabel } from '../../../../../components/code/InlineCodeLabel';
import { EnrichedMappingsServletFilter } from '../../../../../apis/requests/instance/mappings/getInstanceMappingsServletFilters';

type MappingsServletFilterDetailsProps = {
  row: EnrichedMappingsServletFilter;
};

export default function MappingsServletFilterDetails({ row }: MappingsServletFilterDetailsProps) {
  return (
    <Box sx={{ my: 2 }}>
      <Card variant={'outlined'}>
        <CardContent>
          <Stack direction={'column'} spacing={COMPONENTS_SPACING}>
            <TableDetailsLabelValue
              label={<FormattedMessage id={'className'} />}
              value={<InlineCodeLabel code={row.className} />}
            />
            <TableDetailsLabelValue
              label={<FormattedMessage id={'urlPatternMappings'} />}
              value={
                <Box>
                  {row.urlPatternMappings.map((mapping) => (
                    <Box key={mapping}>{mapping}</Box>
                  ))}
                </Box>
              }
            />
            <TableDetailsLabelValue
              label={<FormattedMessage id={'servletNameMappings'} />}
              value={
                <Box>
                  {row.servletNameMappings.map((mapping) => (
                    <Box key={mapping}>{mapping}</Box>
                  ))}
                </Box>
              }
            />
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
