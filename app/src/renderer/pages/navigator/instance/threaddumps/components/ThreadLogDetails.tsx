import React, { useCallback, useMemo } from 'react';
import { Box, Card, CardContent, Stack, Typography } from '@mui/material';
import { ThreadLog } from './ThreadProfilingRequestDetailsDialog';
import { Theme } from '@mui/material/styles';
import { SxProps } from '@mui/system';
import { FormattedMessage } from 'react-intl';
import FormattedDateAndRelativeTime from '../../../../../components/format/FormattedDateAndRelativeTime';
import ThreadLogStackTrace from './ThreadLogStackTrace';
import ToolbarButton from '../../../../../components/common/ToolbarButton';
import { useThreadLog } from '../contexts/ThreadLogContext';
import DetailsLabelValueHorizontal from '../../../../../components/table/details/DetailsLabelValueHorizontal';
import { InlineCodeLabel } from '../../../../../components/code/InlineCodeLabel';

type ThreadLogDetailsProps = {
  threadLog: ThreadLog;
  sx?: SxProps<Theme>;
};

export default function ThreadLogDetails({ threadLog, sx }: ThreadLogDetailsProps) {
  const { toggleOpenHandler } = useThreadLog();

  const showStackTrace = useMemo<boolean>(() => threadLog.stackTrace.length > 0, [threadLog.stackTrace]);

  const closeHandler = useCallback((): void => {
    toggleOpenHandler(threadLog);
  }, [toggleOpenHandler, threadLog]);

  return (
    <Card variant={'outlined'} sx={{ ...sx }}>
      <CardContent sx={{ position: 'relative' }}>
        <ToolbarButton
          tooltip={<FormattedMessage id={'close'} />}
          icon={'CloseOutlined'}
          size={'small'}
          onClick={closeHandler}
          sx={{ position: 'absolute', top: (theme) => theme.spacing(1), right: (theme) => theme.spacing(1) }}
        />
        <Stack direction={'column'} spacing={1.5}>
          <Typography variant={'subtitle1'}>
            <FormattedMessage id={'index'} /> {threadLog.index}
          </Typography>
          <DetailsLabelValueHorizontal
            label={<FormattedMessage id={'time'} />}
            value={<FormattedDateAndRelativeTime value={threadLog.creationTime} showRelative={false} />}
          />
          <DetailsLabelValueHorizontal label={<FormattedMessage id={'threadId'} />} value={threadLog.threadId} />
          <DetailsLabelValueHorizontal label={<FormattedMessage id={'threadName'} />} value={threadLog.threadName} />
          <DetailsLabelValueHorizontal
            label={<FormattedMessage id={'threadState'} />}
            value={<InlineCodeLabel code={threadLog.threadState} />}
          />
          <DetailsLabelValueHorizontal
            label={<FormattedMessage id={'blockedCount'} />}
            value={threadLog.blockedCount}
          />
          <DetailsLabelValueHorizontal label={<FormattedMessage id={'blockedTime'} />} value={threadLog.blockedTime} />
          <DetailsLabelValueHorizontal label={<FormattedMessage id={'waitedCount'} />} value={threadLog.waitedCount} />
          <DetailsLabelValueHorizontal label={<FormattedMessage id={'waitedTime'} />} value={threadLog.waitedTime} />
          <DetailsLabelValueHorizontal label={<FormattedMessage id={'lockName'} />} value={threadLog.lockName} />
          <DetailsLabelValueHorizontal label={<FormattedMessage id={'lockOwnerId'} />} value={threadLog.lockOwnerId} />
          <DetailsLabelValueHorizontal
            label={<FormattedMessage id={'lockOwnerName'} />}
            value={threadLog.lockOwnerName}
          />
        </Stack>

        {showStackTrace && (
          <Box sx={{ mt: 2 }}>
            <ThreadLogStackTrace threadLog={threadLog} />
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
