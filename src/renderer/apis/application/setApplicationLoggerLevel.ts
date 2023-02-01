import { BaseMutationOptions, BaseUseMutationResult, useBaseMutation } from 'renderer/apis/base/useBaseMutation';
import { apiKeys } from 'renderer/apis/apiKeys';
import { ActuatorLogLevel } from 'infra/actuator/model/loggers';

type Variables = {
  applicationId: string;
  loggerName: string;
  level?: ActuatorLogLevel;
};

type Data = void;

export const setApplicationLoggerLevel = async (variables: Variables): Promise<Data> => {
  return await window.instance.setApplicationLoggerLevel(
    variables.applicationId,
    variables.loggerName,
    variables.level
  );
};

export const useSetApplicationLoggerLevel = (
  options?: BaseMutationOptions<Data, Variables>
): BaseUseMutationResult<Data, Variables> =>
  useBaseMutation<Data, Variables>(setApplicationLoggerLevel, {
    ...options,
    invalidateQueriesKeyFn: (data, variables) => apiKeys.itemLoggers(variables.applicationId),
  });
