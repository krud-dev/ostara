import React from 'react';
import { EnrichedLiquibaseChangeSet } from 'renderer/apis/requests/instance/liquibase/getInstanceLiquibaseChangesets';
import DetailsLabelValueVertical from 'renderer/components/table/details/DetailsLabelValueVertical';
import { FormattedMessage } from 'react-intl';
import { Card, CardContent } from '@mui/material';
import { DEFAULT_TABLE_COLUMN_WIDTH, EMPTY_STRING } from 'renderer/constants/ui';

type LiquibaseChangesetDetailsProps = {
  row: EnrichedLiquibaseChangeSet;
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
        <DetailsLabelValueVertical label={<FormattedMessage id={'id'} />} value={row.id} />
        <DetailsLabelValueVertical label={<FormattedMessage id={'bean'} />} value={row.bean} />
        <DetailsLabelValueVertical label={<FormattedMessage id={'changelog'} />} value={row.changeLog} />
        <DetailsLabelValueVertical label={<FormattedMessage id={'deploymentId'} />} value={row.deploymentId} />
        <DetailsLabelValueVertical label={<FormattedMessage id={'comments'} />} value={row.comments} />
        <DetailsLabelValueVertical label={<FormattedMessage id={'author'} />} value={row.author} />
        <DetailsLabelValueVertical label={<FormattedMessage id={'checksum'} />} value={row.checksum || EMPTY_STRING} />
        <DetailsLabelValueVertical
          label={<FormattedMessage id={'contexts'} />}
          value={row.contexts?.join(', ') || EMPTY_STRING}
        />
        <DetailsLabelValueVertical
          label={<FormattedMessage id={'labels'} />}
          value={row.labels?.join(', ') || EMPTY_STRING}
        />
        <DetailsLabelValueVertical label={<FormattedMessage id={'tag'} />} value={row.tag || EMPTY_STRING} />
      </CardContent>
    </Card>
  );
}
