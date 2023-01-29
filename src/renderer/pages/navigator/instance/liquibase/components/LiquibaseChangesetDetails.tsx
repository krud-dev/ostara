import React from 'react';
import { EnrichedActuatorLiquibaseChangeset } from 'renderer/apis/instance/getInstanceLiquibaseChangesets';
import TableDetailsLabelValue from 'renderer/components/table/details/TableDetailsLabelValue';
import { FormattedMessage } from 'react-intl';
import { Card, CardContent } from '@mui/material';
import { DEFAULT_TABLE_COLUMN_WIDTH } from 'renderer/constants/ui';

type LiquibaseChangesetDetailsProps = {
  row: EnrichedActuatorLiquibaseChangeset;
};

export default function LiquibaseChangesetDetails({ row }: LiquibaseChangesetDetailsProps) {
  return (
    <Card variant={'outlined'} sx={{ my: 2 }}>
      <CardContent
        sx={{
          display: 'grid',
          gridTemplateColumns: `repeat(auto-fit, minmax(${DEFAULT_TABLE_COLUMN_WIDTH}px, 1fr))`,
          gridGap: (theme) => theme.spacing(1),
        }}
      >
        <TableDetailsLabelValue label={<FormattedMessage id={'id'} />} value={row.id} />
        <TableDetailsLabelValue label={<FormattedMessage id={'changelog'} />} value={row.changeLog} />
        <TableDetailsLabelValue label={<FormattedMessage id={'comments'} />} value={row.comments} />
        <TableDetailsLabelValue label={<FormattedMessage id={'deploymentId'} />} value={row.deploymentId} />
        <TableDetailsLabelValue label={<FormattedMessage id={'checksum'} />} value={row.checksum || '\u00A0'} />
        <TableDetailsLabelValue
          label={<FormattedMessage id={'contexts'} />}
          value={row.contexts?.join(', ') || '\u00A0'}
        />
        <TableDetailsLabelValue label={<FormattedMessage id={'labels'} />} value={row.labels?.join(', ') || '\u00A0'} />
        <TableDetailsLabelValue label={<FormattedMessage id={'tag'} />} value={row.tag || '\u00A0'} />
      </CardContent>
    </Card>
  );
}
