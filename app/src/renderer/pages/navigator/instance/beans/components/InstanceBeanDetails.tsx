import { Box, Card, CardContent, Link, Stack, Typography } from '@mui/material';
import { InstanceBean } from 'renderer/apis/requests/instance/beans/getInstanceBeans';
import { FormattedMessage } from 'react-intl';
import { COMPONENTS_SPACING } from 'renderer/constants/ui';
import React, { useCallback } from 'react';
import { InlineCodeLabel } from 'renderer/components/code/InlineCodeLabel';
import DetailsLabelValueVertical from 'renderer/components/table/details/DetailsLabelValueVertical';
import { useTable } from '../../../../../components/table/TableContext';

type InstanceBeanDetailsProps = {
  row: InstanceBean;
};

export default function InstanceBeanDetails({ row }: InstanceBeanDetailsProps) {
  const { highlightHandler } = useTable<InstanceBean, unknown>();

  const dependencyClickHandler = useCallback(
    (event: React.MouseEvent, dependency: string) => {
      event.preventDefault();

      highlightHandler(dependency);
    },
    [highlightHandler]
  );

  return (
    <Card variant={'outlined'} sx={{ my: 2 }}>
      <CardContent>
        <Stack direction={'column'} spacing={COMPONENTS_SPACING}>
          <DetailsLabelValueVertical
            label={<FormattedMessage id={'type'} />}
            value={<InlineCodeLabel code={row.type} />}
          />
          {!!row.dependencies?.length && (
            <Box>
              <Typography
                variant={'caption'}
                sx={{ color: 'text.secondary', fontWeight: 'bold', textTransform: 'uppercase' }}
              >
                <FormattedMessage id={'dependencies'} />
              </Typography>
              {row.dependencies.map((dependency) => (
                <Typography variant={'body2'} key={dependency}>
                  <Link href={`#${dependency}`} onClick={(event) => dependencyClickHandler(event, dependency)}>
                    {dependency}
                  </Link>
                </Typography>
              ))}
            </Box>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}
