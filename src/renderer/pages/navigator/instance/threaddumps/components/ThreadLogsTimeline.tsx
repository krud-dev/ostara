import React, { useMemo } from 'react';
import { Box, Typography } from '@mui/material';
import { THREAD_LOG_BAR_HEIGHT, THREAD_LOG_BAR_LABEL_WIDTH } from './ThreadProfilingRequestDetailsDialog';
import { range } from 'lodash';

const FRAMES_MULTIPLIER = 5;

type ThreadLogsTimelineProps = {
  logsCount: number;
};

export default function ThreadLogsTimeline({ logsCount }: ThreadLogsTimelineProps) {
  const frames = useMemo<number[]>(() => range(logsCount / FRAMES_MULTIPLIER), [logsCount]);
  const logWidth = useMemo<number>(() => (100 / logsCount) * FRAMES_MULTIPLIER, [logsCount]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'row' }}>
      <Typography
        variant={'body1'}
        noWrap
        sx={{
          width: THREAD_LOG_BAR_LABEL_WIDTH,
          minWidth: THREAD_LOG_BAR_LABEL_WIDTH,
          pr: 1,
          lineHeight: `${THREAD_LOG_BAR_HEIGHT}px`,
        }}
      />

      <Box sx={{ flexGrow: 1 }}>
        {frames.map((frame) => (
          <Typography
            variant={'subtitle2'}
            sx={{ width: `${logWidth}%`, display: 'inline-block', lineHeight: `${THREAD_LOG_BAR_HEIGHT}px` }}
            key={frame}
          >
            {frame * FRAMES_MULTIPLIER}
          </Typography>
        ))}
      </Box>
    </Box>
  );
}
