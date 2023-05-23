import React from 'react';
import DetailsLabelValueVertical from 'renderer/components/table/details/DetailsLabelValueVertical';
import { FormattedMessage } from 'react-intl';
import { Card, CardContent } from '@mui/material';
import { DEFAULT_TABLE_COLUMN_WIDTH } from 'renderer/constants/ui';
import { EnrichedFlywayMigration } from 'renderer/apis/requests/instance/flyway/getInstanceFlywayMigrations';

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
        <DetailsLabelValueVertical label={<FormattedMessage id={'bean'} />} value={row.bean} />
        <DetailsLabelValueVertical label={<FormattedMessage id={'type'} />} value={row.type} />
        <DetailsLabelValueVertical label={<FormattedMessage id={'script'} />} value={row.script} />
        <DetailsLabelValueVertical label={<FormattedMessage id={'executionTime'} />} value={row.executionTime} />
        <DetailsLabelValueVertical label={<FormattedMessage id={'installedBy'} />} value={row.installedBy} />
        <DetailsLabelValueVertical label={<FormattedMessage id={'checksum'} />} value={row.checksum} />
      </CardContent>
    </Card>
  );
}
