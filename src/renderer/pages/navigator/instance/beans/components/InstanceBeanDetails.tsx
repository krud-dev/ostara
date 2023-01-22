import { Box, Link, Stack, Typography } from '@mui/material';
import { InstanceBean } from 'renderer/apis/instance/getInstanceBeans';
import { FormattedMessage } from 'react-intl';
import { COMPONENTS_SPACING, SECONDARY_SCROLL_CONTAINER_ID } from 'renderer/constants/ui';
import { useScrollAndHighlightElement } from 'renderer/hooks/useScrollAndHighlightElement';
import React, { useCallback } from 'react';
import { InlineCodeLabel } from 'renderer/components/code/InlineCodeLabel';
import TableDetailsLabelValue from 'renderer/components/table/details/TableDetailsLabelValue';

type InstanceBeanDetailsProps = {
  row: InstanceBean;
};

export default function InstanceBeanDetails({ row }: InstanceBeanDetailsProps) {
  const highlightAndScroll = useScrollAndHighlightElement();

  const dependencyClickHandler = useCallback(
    (event: React.MouseEvent, dependency: string) => {
      event.preventDefault();
      highlightAndScroll(dependency, { containerId: SECONDARY_SCROLL_CONTAINER_ID });
    },
    [highlightAndScroll]
  );

  return (
    <Stack direction={'column'} spacing={COMPONENTS_SPACING}>
      <TableDetailsLabelValue label={<FormattedMessage id={'type'} />} value={<InlineCodeLabel code={row.type} />} />
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
  );
}
