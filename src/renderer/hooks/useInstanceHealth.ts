import { useCallback, useEffect, useMemo, useState } from 'react';
import { InstanceHealthRO, InstanceRO } from '../../common/generated_definitions';
import { useUpdateEffect } from 'react-use';
import { useUpdateInstanceHealthQuery } from '../apis/requests/instance/health/updateInstanceHealth';

type InstanceHealthResult = {
  health: InstanceHealthRO;
  loading: boolean;
  refreshHealth: () => Promise<void>;
};

const useInstanceHealth = (item: InstanceRO): InstanceHealthResult => {
  const [health, setHealth] = useState<InstanceHealthRO>(item.health);
  const [loading, setLoading] = useState<boolean>(false);

  useUpdateEffect(() => {
    if (item.health.lastUpdateTime > health.lastUpdateTime) {
      setHealth(item.health);
    }
  }, [item.health]);

  const healthState = useUpdateInstanceHealthQuery({ instanceId: item.id }, { refetchInterval: 1000 * 5 });

  useEffect(() => {
    const updatedHealth = healthState.data;
    if (updatedHealth) {
      setHealth(updatedHealth);
    }
  }, [healthState.data]);

  const refreshHandler = useCallback(async (): Promise<void> => {
    setLoading(true);

    try {
      await healthState.refetch();
    } catch (e) {}

    setLoading(false);
  }, [healthState, setLoading]);

  return useMemo<InstanceHealthResult>(
    () => ({ health, loading, refreshHealth: refreshHandler }),
    [health, refreshHandler]
  );
};
export default useInstanceHealth;
