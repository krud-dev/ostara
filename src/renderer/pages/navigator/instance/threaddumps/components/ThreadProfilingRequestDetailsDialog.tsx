import { FormattedMessage } from 'react-intl';
import React, { FunctionComponent, useCallback, useMemo } from 'react';
import { Box, Dialog, DialogContent, Stack } from '@mui/material';
import NiceModal, { NiceModalHocProps, useModal } from '@ebay/nice-modal-react';
import DialogTitleEnhanced from 'renderer/components/dialog/DialogTitleEnhanced';
import {
  ThreadDumpActuatorResponse$Thread,
  ThreadProfilingRequestRO,
} from '../../../../../../common/generated_definitions';
import { useGetInstanceThreadProfilingRequestLogsQuery } from '../../../../../apis/requests/instance/thread-profiling/getInstanceThreadProfilingRequestLogs';
import { chain, map } from 'lodash';
import ThreadLogsBar from './ThreadLogsBar';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { ThreadLogContext, ThreadLogProvider } from '../contexts/ThreadLogContext';
import SearchToolbar from '../../../../../components/common/SearchToolbar';
import ToolbarButton from '../../../../../components/common/ToolbarButton';
import ThreadLogsTimeline from './ThreadLogsTimeline';
import LogoLoader from '../../../../../components/common/LogoLoader';

export const THREAD_LOG_BAR_HEIGHT = 36;
export const THREAD_LOG_BAR_LABEL_WIDTH = 200;

export type ThreadLog = { creationTime: number; index: number; uniqueId: string } & ThreadDumpActuatorResponse$Thread;

export type ThreadProfilingRequestDetailsDialogProps = {
  request: ThreadProfilingRequestRO;
};

const ThreadProfilingRequestDetailsDialog: FunctionComponent<
  ThreadProfilingRequestDetailsDialogProps & NiceModalHocProps
> = NiceModal.create(({ request }) => {
  const modal = useModal();

  const closeHandler = useCallback((): void => {
    modal.resolve(undefined);
    modal.hide();
  }, [modal]);

  const logsState = useGetInstanceThreadProfilingRequestLogsQuery({
    instanceId: request.instanceId,
    requestId: request.id,
  });

  const creationTimeIndex = useMemo<{ [key: number]: number }>(
    () => logsState.data?.results.reduce((acc, log, index) => ({ ...acc, [log.creationTime]: index }), {}) ?? {},
    [logsState.data]
  );

  const logsCount = useMemo<number>(() => logsState.data?.results.length ?? 0, [logsState.data]);

  const threadLogsMap = useMemo<{ [key: number]: ThreadLog[] } | undefined>(
    () =>
      logsState.data
        ? chain(logsState.data.results)
            .map((log) =>
              log.threads.map((thread) => ({
                ...thread,
                creationTime: log.creationTime,
                index: creationTimeIndex[log.creationTime],
                uniqueId: `${thread.threadState}_${JSON.stringify(thread.stackTrace)}`,
              }))
            )
            .flatten()
            .groupBy('threadId')
            .value()
        : undefined,
    [creationTimeIndex]
  );

  return (
    <ThreadLogProvider>
      <ThreadLogContext.Consumer>
        {({ setSearch, closeAllHandler }) => (
          <Dialog
            open={modal.visible}
            onClose={closeHandler}
            TransitionProps={{
              onExited: () => modal.remove(),
            }}
            fullWidth
            maxWidth={false}
            PaperProps={{
              sx: {
                height: '100%',
              },
            }}
          >
            <DialogTitleEnhanced onClose={closeHandler}>
              <FormattedMessage id={'threadDumpDetails'} />
            </DialogTitleEnhanced>
            <DialogContent sx={{ overflow: 'hidden', pb: 2 }}>
              <SearchToolbar onFilterChange={setSearch} sx={{ p: 0 }}>
                <ToolbarButton
                  tooltipLabelId={'collapseAll'}
                  icon={'UnfoldLessDoubleOutlined'}
                  onClick={closeAllHandler}
                />
              </SearchToolbar>

              <ThreadLogsTimeline logsCount={logsCount} />
            </DialogContent>
            <Box sx={{ height: '100%', overflow: 'hidden' }}>
              <PerfectScrollbar>
                {!threadLogsMap ? (
                  <DialogContent
                    sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', pt: 0 }}
                  >
                    <LogoLoader />
                  </DialogContent>
                ) : (
                  <DialogContent sx={{ pt: 0 }}>
                    <Stack direction={'column'} spacing={1}>
                      {map(threadLogsMap, (threadLogs, threadId) => (
                        <ThreadLogsBar threadLogs={threadLogs} logsCount={logsCount} key={threadId} />
                      ))}
                    </Stack>
                  </DialogContent>
                )}
              </PerfectScrollbar>
            </Box>
          </Dialog>
        )}
      </ThreadLogContext.Consumer>
    </ThreadLogProvider>
  );
});

export default ThreadProfilingRequestDetailsDialog;
