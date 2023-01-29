import { Box, Card, CardContent, CircularProgress } from '@mui/material';
import { FormattedMessage } from 'react-intl';
import React, { ReactNode } from 'react';
import TableDetailsLabelValue from 'renderer/components/table/details/TableDetailsLabelValue';

export type CacheProperty = {
  value: number;
  tooltip?: ReactNode;
};

export type ItemCacheStatistics = {
  gets: CacheProperty;
  puts: CacheProperty;
  evictions: CacheProperty;
  hits: CacheProperty;
  misses: CacheProperty;
  removals: CacheProperty;
  size: CacheProperty;
};

type ItemCacheDetailsProps = {
  statistics?: ItemCacheStatistics;
};

export default function ItemCacheDetails({ statistics }: ItemCacheDetailsProps) {
  return (
    <>
      {!statistics ? (
        <Box sx={{ textAlign: 'center' }}>
          <CircularProgress />
        </Box>
      ) : (
        <Card variant={'outlined'} sx={{ my: 2 }}>
          <CardContent
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
              gridGap: (theme) => theme.spacing(1),
            }}
          >
            <TableDetailsLabelValue
              label={<FormattedMessage id={'gets'} />}
              value={statistics.gets.value}
              tooltip={statistics.gets.tooltip}
            />
            <TableDetailsLabelValue
              label={<FormattedMessage id={'puts'} />}
              value={statistics.puts.value}
              tooltip={statistics.puts.tooltip}
            />
            <TableDetailsLabelValue
              label={<FormattedMessage id={'evictions'} />}
              value={statistics.evictions.value}
              tooltip={statistics.evictions.tooltip}
            />
            <TableDetailsLabelValue
              label={<FormattedMessage id={'hits'} />}
              value={statistics.hits.value}
              tooltip={statistics.hits.tooltip}
            />
            <TableDetailsLabelValue
              label={<FormattedMessage id={'misses'} />}
              value={statistics.misses.value}
              tooltip={statistics.misses.tooltip}
            />
            <TableDetailsLabelValue
              label={<FormattedMessage id={'removals'} />}
              value={statistics.removals.value}
              tooltip={statistics.removals.tooltip}
            />
            <TableDetailsLabelValue
              label={<FormattedMessage id={'size'} />}
              value={statistics.size.value}
              tooltip={statistics.size.tooltip}
            />
          </CardContent>
        </Card>
      )}
    </>
  );
}
