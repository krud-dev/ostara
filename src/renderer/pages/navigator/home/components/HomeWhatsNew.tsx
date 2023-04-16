import { Box, Card, CardContent, Typography } from '@mui/material';
import React, { useMemo } from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import AutoSizer from 'react-virtualized-auto-sizer';
import changelog from '../../../../../../CHANGELOG.md';
import { FormattedMessage } from 'react-intl';
import Markdown from '../../../../components/code/Markdown';

type HomeWhatsNewProps = {};

export default function HomeWhatsNew({}: HomeWhatsNewProps) {
  const markdown = useMemo<string>(() => changelog.split('\n').slice(2).join('\n'), []);

  return (
    <Card sx={{ flexGrow: 1, minHeight: 300 }}>
      <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Typography variant={'h6'} gutterBottom>
          <FormattedMessage id={'whatsNew'} /> &#x1F380;
        </Typography>

        <Box sx={{ flexGrow: 1, overflow: 'hidden' }}>
          <AutoSizer disableWidth>
            {({ height }) => (
              <Box sx={{ height: height, overflow: 'hidden' }}>
                <PerfectScrollbar options={{ wheelPropagation: true, suppressScrollX: true }}>
                  <Markdown>{markdown}</Markdown>
                </PerfectScrollbar>
              </Box>
            )}
          </AutoSizer>
        </Box>
      </CardContent>
    </Card>
  );
}
