import React, { FunctionComponent, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Page from 'renderer/components/layout/Page';
import { useNavigatorLayout } from 'renderer/contexts/NavigatorLayoutContext';
import { Card, CardHeader, Divider } from '@mui/material';
import { isNil } from 'lodash';
import { InstanceRO } from 'common/generated_definitions';
import LogoLoaderCenter from 'renderer/components/common/LogoLoaderCenter';
import { useGetInstanceLogfile } from 'renderer/apis/requests/instance/logfile/getInstanceLogfile';
import { useUpdateEffect } from 'react-use';
import InstanceLogCode from 'renderer/pages/navigator/instance/logfile/components/InstanceLogCode';
import { FormattedMessage } from 'react-intl';
import ToolbarButton from 'renderer/components/common/ToolbarButton';
import { useDownloadInstanceLogfile } from 'renderer/apis/requests/instance/logfile/downloadInstanceLogfile';
import { getItemDisplayName } from 'renderer/utils/itemUtils';

const LOG_INTERVAL = 3_000;
const LOG_MAX_LENGTH = 131_072;

const InstanceLogfile: FunctionComponent = () => {
  const { selectedItem } = useNavigatorLayout();

  const item = useMemo<InstanceRO>(() => selectedItem as InstanceRO, [selectedItem]);

  const [log, setLog] = useState<string | undefined>(undefined);
  const [requestFlag, setRequestFlag] = useState<boolean>(false);
  const [active, setActive] = useState<boolean>(true);

  const logfileState = useGetInstanceLogfile({ disableGlobalError: true, cacheTime: 0 });

  useUpdateEffect(() => {
    if (!active) {
      return;
    }

    if (logfileState.isLoading) {
      return;
    }

    (async () => {
      try {
        const result = await logfileState.mutateAsync({
          instanceId: item.id,
        });
        setLog(result.slice(-LOG_MAX_LENGTH));
      } catch (e) {
        setActive(false);
      }
    })();
  }, [requestFlag]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (active) {
      setRequestFlag((prev) => !prev);
      interval = setInterval(() => {
        setRequestFlag((prev) => !prev);
      }, LOG_INTERVAL);
    }

    return () => {
      clearInterval(interval);
    };
  }, [active]);

  const uiStatus = useMemo<'loading' | 'content'>(() => {
    if (isNil(log)) {
      return 'loading';
    }
    return 'content';
  }, [log]);

  const downloadState = useDownloadInstanceLogfile();

  const downloadHandler = useCallback(async (): Promise<void> => {
    await downloadState.mutateAsync({ instanceId: item.id, instanceName: getItemDisplayName(item) });
  }, [downloadState, item]);

  return (
    <Page sx={{ height: '100%' }}>
      {uiStatus === 'loading' && <LogoLoaderCenter />}
      {uiStatus === 'content' && (
        <Card>
          <CardHeader
            title={<FormattedMessage id={'logfile'} />}
            action={
              <ToolbarButton
                tooltip={<FormattedMessage id={'download'} />}
                icon={'DownloadOutlined'}
                onClick={downloadHandler}
              />
            }
            sx={{ pb: 3 }}
          />
          <Divider />
          <InstanceLogCode log={log!} />
        </Card>
      )}
    </Page>
  );
};

export default InstanceLogfile;
