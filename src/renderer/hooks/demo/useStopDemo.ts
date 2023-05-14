import { useCallback, useMemo, useState } from 'react';
import { useDeleteDemo } from '../../apis/requests/demo/deleteDemo';

type StopDemoResult = {
  stopDemo: () => Promise<void>;
  loading: boolean;
};

const useStopDemo = (): StopDemoResult => {
  const [loading, setLoading] = useState<boolean>(false);

  const deleteDemoState = useDeleteDemo();

  const stopDemo = useCallback(async (): Promise<void> => {
    setLoading(true);

    try {
      await deleteDemoState.mutateAsync({});

      await window.demo.stopDemo();
    } catch (error) {}

    setLoading(false);
  }, []);

  return useMemo<StopDemoResult>(() => ({ stopDemo, loading }), [stopDemo, loading]);
};
export default useStopDemo;
