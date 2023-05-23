import { useCallback, useMemo, useState } from 'react';
import { useAnalytics } from '../../contexts/AnalyticsContext';

type RestartDemoResult = {
  restartDemo: () => Promise<void>;
  loading: boolean;
};

const useRestartDemo = (): RestartDemoResult => {
  const { track } = useAnalytics();

  const [loading, setLoading] = useState<boolean>(false);

  const restartDemo = useCallback(async (): Promise<void> => {
    track({ name: 'demo_restart' });

    setLoading(true);

    try {
      await window.demo.stopDemo();
      await window.demo.startDemo();
    } catch (error) {}

    setLoading(false);
  }, [setLoading]);

  return useMemo<RestartDemoResult>(() => ({ restartDemo, loading }), [restartDemo, loading]);
};
export default useRestartDemo;
