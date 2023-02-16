import React from 'react';
import TableDetailsLabelValue from 'renderer/components/table/details/TableDetailsLabelValue';
import { FormattedMessage } from 'react-intl';
import { Card, CardContent } from '@mui/material';
import { EnrichedFlywayMigration } from 'renderer/apis/instance/getInstanceFlywayMigrations';
import { DEFAULT_TABLE_COLUMN_WIDTH } from 'renderer/constants/ui';

type FlywayMigrationDetailsProps = {
  row: EnrichedFlywayMigration;
};

export default function FlywayMigrationDetails({ row }: FlywayMigrationDetailsProps) {
  return (
    <Card variant={'outlined'} sx={{ my: 2 }}>
      <CardContent
        sx={{
          display: 'grid',
          gridTemplateColumns: `repeat(auto-fit, minmax(${DEFAULT_TABLE_COLUMN_WIDTH}px, 1fr))`,
          gridGap: (theme) => theme.spacing(1),
        }}
      >
        <TableDetailsLabelValue label={<FormattedMessage id={'bean'} />} value={row.bean} />
        <TableDetailsLabelValue label={<FormattedMessage id={'type'} />} value={row.type} />
        <TableDetailsLabelValue label={<FormattedMessage id={'script'} />} value={row.script} />
        <TableDetailsLabelValue label={<FormattedMessage id={'executionTime'} />} value={row.executionTime} />
        <TableDetailsLabelValue label={<FormattedMessage id={'version'} />} value={row.version} />
        <TableDetailsLabelValue label={<FormattedMessage id={'checksum'} />} value={row.checksum} />
      </CardContent>
    </Card>
  );
}
