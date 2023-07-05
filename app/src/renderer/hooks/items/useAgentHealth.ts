import { useCallback, useMemo, useState } from 'react';
import { AgentHealthDTO, AgentRO } from 'common/generated_definitions';
import { useUpdateEffect } from 'react-use';
import { useUpdateAgentHealth } from 'renderer/apis/requests/agent/health/updateAgentHealth';

type AgentHealthResult = {
  health: AgentHealthDTO;
  loading: boolean;
  refreshHealth: () => Promise<void>;
};

const useAgentHealth = (item: AgentRO): AgentHealthResult => {
  const [health, setHealth] = useState<AgentHealthDTO>(item.health);
  const [loading, setLoading] = useState<boolean>(false);

  useUpdateEffect(() => {
    if (item.health.time > health.time) {
      setHealth(item.health);
    }
  }, [item.health]);

  const healthState = useUpdateAgentHealth();

  const refreshHandler = useCallback(async (): Promise<void> => {
    setLoading(true);

    try {
      const result = await healthState.mutateAsync({ agentId: item.id });
      setHealth(result);
    } catch (e) {}

    setLoading(false);
  }, [healthState, setLoading]);

  return useMemo<AgentHealthResult>(
    () => ({ health, loading, refreshHealth: refreshHandler }),
    [health, loading, refreshHandler]
  );
};
export default useAgentHealth;
