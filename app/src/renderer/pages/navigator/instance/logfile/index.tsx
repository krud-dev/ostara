import React, { FunctionComponent, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Page from 'renderer/components/layout/Page';
import { useNavigatorLayout } from 'renderer/contexts/NavigatorLayoutContext';
import { Card } from '@mui/material';
import { isNil } from 'lodash';
import EmptyContent from 'renderer/components/help/EmptyContent';
import { InstanceRO } from 'common/generated_definitions';
import LogoLoaderCenter from 'renderer/components/common/LogoLoaderCenter';
import { useGetInstanceLogfile } from 'renderer/apis/requests/instance/logfile/getInstanceLogfile';

const InstanceLogfile: FunctionComponent = () => {
  const { selectedItem } = useNavigatorLayout();

  const item = useMemo<InstanceRO>(() => selectedItem as InstanceRO, [selectedItem]);

  const [log, setLog] = useState<string | undefined>(undefined);
  const start = useRef<number>(new Date().getTime() - 1000 * 60 * 5);

  const logfileState = useGetInstanceLogfile();

  const updateLog = useCallback(async (): Promise<void> => {
    const now = new Date().getTime();
    try {
      const result = await logfileState.mutateAsync({ instanceId: item.id, start: start.current, end: now });
      setLog((prev) => (prev ? prev + result : result));

      start.current = now;
    } catch (e) {}
  }, [item]);

  useEffect(() => {
    updateLog();

    const interval = setInterval(() => {
      updateLog();
    }, 5000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const uiStatus = useMemo<'loading' | 'empty' | 'content'>(() => {
    if (isNil(log)) {
      return 'loading';
    }
    if (!log) {
      return 'empty';
    }
    return 'content';
  }, [log]);

  return (
    <Page sx={{ height: '100%' }}>
      {uiStatus === 'loading' && <LogoLoaderCenter />}
      {uiStatus === 'empty' && <EmptyContent />}
      {uiStatus === 'content' && <Card>{log}</Card>}
    </Page>
  );
};

export default InstanceLogfile;
