import { BaseMutationOptions, BaseUseMutationResult, useBaseMutation } from 'renderer/apis/base/useBaseMutation';
import { apiKeys } from 'renderer/apis/apiKeys';
import { ActuatorLogLevel } from 'infra/actuator/model/loggers';

type Variables = {
  instanceId: string;
  loggerName: string;
  level?: ActuatorLogLevel;
};

type Data = void;

export const setInstanceLoggerLevel = async (variables: Variables): Promise<Data> => {
  return await window.instance.setInstanceLoggerLevel(variables.instanceId, variables.loggerName, variables.level);
};

export const useSetInstanceLoggerLevel = (
  options?: BaseMutationOptions<Data, Variables>
): BaseUseMutationResult<Data, Variables> =>
  useBaseMutation<Data, Variables>(setInstanceLoggerLevel, {
    ...options,
    invalidateQueriesKeyFn: (data, variables) => apiKeys.itemLoggers(variables.instanceId),
  });
