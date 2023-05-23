import {
  BaseMutationOptions,
  BaseUseMutationResult,
  useBaseMutation,
} from 'renderer/apis/requests/base/useBaseMutation';
import { apiKeys } from 'renderer/apis/apiKeys';
import { axiosInstance } from '../../../axiosInstance';
import { AxiosResponse } from 'axios';
import { InstanceLoggerRO } from '../../../../../common/generated_definitions';

type Variables = {
  instanceId: string;
  loggerName: string;
  level?: string;
};

type Data = InstanceLoggerRO;

export const setInstanceLoggerLevel = async (variables: Variables): Promise<Data> => {
  return (
    await axiosInstance.put<Data, AxiosResponse<Data>, null>(
      `logger/instance/${variables.instanceId}/${variables.loggerName}`,
      null,
      {
        params: { level: variables.level },
      }
    )
  ).data;
};

export const useSetInstanceLoggerLevel = (
  options?: BaseMutationOptions<Data, Variables>
): BaseUseMutationResult<Data, Variables> =>
  useBaseMutation<Data, Variables>(setInstanceLoggerLevel, {
    ...options,
    invalidateQueriesKeyFn: (data, variables) => apiKeys.itemLoggers(variables.instanceId),
  });
