import { Box, Card, CardContent } from '@mui/material';
import { FormattedMessage } from 'react-intl';
import React, { ReactNode, useMemo } from 'react';
import TableDetailsLabelValue from 'renderer/components/table/details/TableDetailsLabelValue';
import LogoLoader from '../../common/LogoLoader';

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
    <Box sx={{ my: 2 }}>
      {!statistics ? (
        <Box sx={{ textAlign: 'center' }}>
          <LogoLoader />
        </Box>
      ) : (
        <Card variant={'outlined'}>
          <CardContent
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
              gridGap: (theme) => theme.spacing(1),
            }}
          >
            <CacheDetailsLabelValue label={<FormattedMessage id={'gets'} />} property={statistics.gets} />
            <CacheDetailsLabelValue label={<FormattedMessage id={'puts'} />} property={statistics.puts} />
            <CacheDetailsLabelValue label={<FormattedMessage id={'evictions'} />} property={statistics.evictions} />
            <CacheDetailsLabelValue label={<FormattedMessage id={'hits'} />} property={statistics.hits} />
            <CacheDetailsLabelValue label={<FormattedMessage id={'misses'} />} property={statistics.misses} />
            <CacheDetailsLabelValue label={<FormattedMessage id={'removals'} />} property={statistics.removals} />
            <CacheDetailsLabelValue label={<FormattedMessage id={'size'} />} property={statistics.size} />
          </CardContent>
        </Card>
      )}
    </Box>
  );
}

type CacheDetailsLabelValueProps = {
  label: ReactNode;
  property: CacheProperty;
};

function CacheDetailsLabelValue({ label, property }: CacheDetailsLabelValueProps) {
  const value = useMemo<ReactNode>(
    () => (property.value < 0 ? <FormattedMessage id={'notAvailable'} /> : property.value),
    [property.value]
  );

  const tooltip = useMemo<ReactNode>(
    () => (property.value < 0 ? <FormattedMessage id={'metricNotFound'} /> : property.tooltip),
    [property]
  );

  return <TableDetailsLabelValue label={label} value={value} tooltip={tooltip} />;
}
