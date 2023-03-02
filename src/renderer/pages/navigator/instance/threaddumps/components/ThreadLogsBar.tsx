import React, { useMemo } from 'react';
import { Box, Stack, Typography } from '@mui/material';
import { THREAD_LOG_BAR_HEIGHT, THREAD_LOG_BAR_LABEL_WIDTH, ThreadLog } from './ThreadProfilingRequestDetailsDialog';
import ThreadLogCell from './ThreadLogCell';
import { keyBy } from 'lodash';
import { useThreadLog } from '../contexts/ThreadLogContext';
import PerfectScrollbar from 'react-perfect-scrollbar';
import ThreadLogDetails from './ThreadLogDetails';

type ThreadLogsBarProps = {
  threadLogs: ThreadLog[];
  logsCount: number;
};

export default function ThreadLogsBar({ threadLogs, logsCount }: ThreadLogsBarProps) {
  const { openIds, isOpen } = useThreadLog();

  const threadName = useMemo<string>(() => threadLogs[0]?.threadName || '', [threadLogs]);

  const threadLogsMerged = useMemo<{ threadLog?: ThreadLog; count: number; index: number }[]>(() => {
    const threadLogIndexMap = keyBy(threadLogs, 'index');

    const result: { threadLog?: ThreadLog; count: number; index: number }[] = [];
    let previousLog: ThreadLog | undefined;
    let index = 0;
    for (let i = 0; i < logsCount; i += 1) {
      const log: ThreadLog | undefined = threadLogIndexMap[i];
      if (i > 0 && log?.uniqueId === previousLog?.uniqueId) {
        result[result.length - 1].count += 1;
      } else {
        result.push({ threadLog: log, count: 1, index: index });
        index += 1;
      }
      previousLog = log;
    }
    return result;
  }, [threadLogs]);

  const logWidth = useMemo<number>(() => 100 / logsCount, [logsCount]);

  const openThreadLogs = useMemo<ThreadLog[]>(() => threadLogs.filter((log) => isOpen(log)), [threadLogs, openIds]);
  const hasOpenThreadLogs = useMemo<boolean>(() => openThreadLogs.length > 0, [openThreadLogs]);

  return (
    <>
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
        >
          {threadName}
        </Typography>
        <Box sx={{ flexGrow: 1 }}>
          {threadLogsMerged.map((value) => (
            <Box sx={{ width: `${logWidth * value.count}%`, display: 'inline-block' }} key={value.index}>
              <ThreadLogCell threadLog={value.threadLog} />
            </Box>
          ))}
        </Box>
      </Box>
      {hasOpenThreadLogs && (
        <Box sx={{ overflow: 'hidden' }}>
          <PerfectScrollbar options={{ suppressScrollY: true }}>
            <Stack direction={'row'} spacing={1} sx={{ py: 1 }}>
              {openThreadLogs.map((threadLog) => (
                <ThreadLogDetails threadLog={threadLog} sx={{ flexGrow: 1, minWidth: 500 }} key={threadLog.index} />
              ))}
            </Stack>
          </PerfectScrollbar>
        </Box>
      )}
    </>
  );
}
