import { useCallback, useMemo, useState } from 'react';
import { useDeleteDemo } from '../../apis/requests/demo/deleteDemo';
import { useAnalytics } from '../../contexts/AnalyticsContext';

type StopDemoResult = {
  stopDemo: () => Promise<void>;
  loading: boolean;
};

const useStopDemo = (): StopDemoResult => {
  const { track } = useAnalytics();

  const [loading, setLoading] = useState<boolean>(false);

  const deleteDemoState = useDeleteDemo();

  const stopDemo = useCallback(async (): Promise<void> => {
    track({ name: 'demo_stop' });

    setLoading(true);

    try {
      await deleteDemoState.mutateAsync({});

      await window.demo.stopDemo();
    } catch (error) {}

    setLoading(false);
  }, [setLoading]);

  return useMemo<StopDemoResult>(() => ({ stopDemo, loading }), [stopDemo, loading]);
};
export default useStopDemo;
