import { Box, Card, CardContent, Stack, Typography } from '@mui/material';
import React, { ReactNode, useCallback, useMemo } from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import AutoSizer from 'react-virtualized-auto-sizer';

type ChangeLogItem = {
  type: 'feature' | 'bug' | 'improvement' | 'version';
  title: string;
};

type HomeWhatsNewProps = {};

export default function HomeWhatsNew({}: HomeWhatsNewProps) {
  const data = useMemo<ChangeLogItem[]>(
    () => [
      { type: 'version', title: 'v0.0.5' },
      { type: 'feature', title: 'Added support for Developer Mode' },
      { type: 'feature', title: "Added support for What's New" },
      { type: 'version', title: 'v0.0.4' },
      { type: 'feature', title: 'Added support for Flyway' },
      { type: 'feature', title: 'Added support for Liquibase' },
      { type: 'feature', title: 'Added support for Secure' },
      { type: 'feature', title: 'Added support for Daemon' },
      { type: 'feature', title: 'Added support for Swagger API Documentation' },
      { type: 'version', title: 'v0.0.3' },
      { type: 'feature', title: 'Added support for Developer Mode' },
      { type: 'feature', title: "Added support for What's New" },
      { type: 'feature', title: 'Added support for Settings' },
      { type: 'feature', title: 'Added support for About' },
      { type: 'feature', title: 'Added support for Help' },
      { type: 'feature', title: 'Added support for Feedback' },
      { type: 'feature', title: 'Added support for Donate' },
      { type: 'feature', title: 'Added support for Exit' },
      { type: 'version', title: 'v0.0.2' },
      { type: 'feature', title: 'Added support for Flyway' },
      { type: 'feature', title: 'Added support for Liquibase' },
      { type: 'feature', title: 'Added support for Secure' },
      { type: 'feature', title: 'Added support for Daemon' },
      { type: 'feature', title: 'Added support for Swagger API Documentation' },
      { type: 'version', title: 'v0.0.1' },
      { type: 'feature', title: 'Initial release' },
    ],
    []
  );

  const renderChangeLogItem = useCallback((item: ChangeLogItem, index: number): ReactNode => {
    switch (item.type) {
      case 'version':
        return (
          <Typography variant={'subtitle2'} sx={{ ...(index > 0 ? { mt: 1 } : {}) }} key={index}>
            {item.title}
          </Typography>
        );
      default:
        return (
          <Typography variant={'body2'} sx={{ color: 'text.secondary' }} key={index}>
            {item.type}: {item.title}
          </Typography>
        );
    }
  }, []);

  return (
    <Card sx={{ flexGrow: 1, minHeight: 300 }}>
      <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Typography variant={'h6'} gutterBottom>
          What's New? &#x1F380;
        </Typography>

        <Box sx={{ flexGrow: 1, overflow: 'hidden' }}>
          <AutoSizer disableWidth>
            {({ height }) => (
              <Box sx={{ height: height, overflow: 'hidden' }}>
                <PerfectScrollbar options={{ wheelPropagation: true, suppressScrollX: true }}>
                  <Stack direction={'column'}>{data.map((item, index) => renderChangeLogItem(item, index))}</Stack>
                </PerfectScrollbar>
              </Box>
            )}
          </AutoSizer>
        </Box>
      </CardContent>
    </Card>
  );
}
