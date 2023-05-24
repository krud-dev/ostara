import React, { useCallback, useMemo } from 'react';
import { Box } from '@mui/material';
import { EMPTY_STRING } from 'renderer/constants/ui';
import { THREAD_LOG_BAR_HEIGHT, ThreadLog } from './ThreadProfilingRequestDetailsDialog';
import { alpha, lighten, Theme, useTheme } from '@mui/material/styles';
import { useThreadLog } from '../contexts/ThreadLogContext';
import { SxProps } from '@mui/system';

type ThreadLogCellProps = {
  threadLog?: ThreadLog;
};

export default function ThreadLogCell({ threadLog }: ThreadLogCellProps) {
  const theme = useTheme();
  const { search, openIds, toggleOpenHandler, isOpen, isHighlight } = useThreadLog();

  const backgroundColor = useMemo<string>(() => {
    if (!threadLog) {
      return theme.palette.grey[500_16];
    }
    switch (threadLog.threadState) {
      case 'NEW':
        return theme.palette.success.light;
      case 'RUNNABLE':
        return theme.palette.success.main;
      case 'BLOCKED':
        return theme.palette.error.main;
      case 'WAITING':
        return theme.palette.warning.light;
      case 'TIMED_WAITING':
        return theme.palette.warning.darker;
      case 'TERMINATED':
        return theme.palette.common.black;
      default:
        return theme.palette.grey[500_16];
    }
  }, [threadLog]);

  const highlight = useMemo<boolean>(() => !!threadLog && isHighlight(search, threadLog), [search, threadLog]);

  const openBackgroundColor = useMemo<string>(() => lighten(backgroundColor, 0.4), [backgroundColor]);

  const open = useMemo<boolean>(() => isOpen(threadLog), [threadLog, openIds]);

  const hoverBackgroundColor = useMemo<string>(
    () => lighten(backgroundColor, open ? 0.5 : 0.25),
    [backgroundColor, open]
  );

  const hoverSxProps = useMemo<SxProps<Theme> | undefined>(
    () =>
      threadLog
        ? {
            cursor: 'pointer',
            '&:hover': { backgroundColor: hoverBackgroundColor },
          }
        : { cursor: 'default' },
    [threadLog, hoverBackgroundColor]
  );

  const clickHandler = useCallback(() => {
    toggleOpenHandler(threadLog);
  }, [threadLog, toggleOpenHandler]);

  return (
    <Box
      onClick={clickHandler}
      sx={{
        height: THREAD_LOG_BAR_HEIGHT,
        backgroundColor: backgroundColor,
        ...hoverSxProps,
        ...(open ? { backgroundColor: openBackgroundColor } : {}),
        position: 'relative',
      }}
    >
      {EMPTY_STRING}
      <Box
        sx={{
          position: 'absolute',
          width: '1px',
          top: 0,
          bottom: 0,
          right: 0,
          backgroundColor: alpha(theme.palette.divider, 0.5),
        }}
      />
      {highlight && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            border: `1px solid ${theme.palette.info.main}`,
            backgroundColor: alpha(theme.palette.info.main, 0.2),
          }}
        />
      )}
    </Box>
  );
}
