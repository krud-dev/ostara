import { BaseMutationOptions, BaseUseMutationResult, useBaseMutation } from 'renderer/apis/base/useBaseMutation';
import { apiKeys } from 'renderer/apis/apiKeys';
import { axiosInstance } from '../axiosInstance';
import { AxiosResponse } from 'axios';
import { ApplicationLoggerRO, LogLevel } from '../../../common/generated_definitions';

type Variables = {
  applicationId: string;
  loggerName: string;
  level?: LogLevel;
};

type Data = ApplicationLoggerRO;

export const setApplicationLoggerLevel = async (variables: Variables): Promise<Data> => {
  return (
    await axiosInstance.put<Data, AxiosResponse<Data>, null>(
      `logger/application/${variables.applicationId}/${variables.loggerName}`,
      null,
      {
        params: { level: variables.level },
      }
    )
  ).data;
};

export const useSetApplicationLoggerLevel = (
  options?: BaseMutationOptions<Data, Variables>
): BaseUseMutationResult<Data, Variables> =>
  useBaseMutation<Data, Variables>(setApplicationLoggerLevel, {
    ...options,
    invalidateQueriesKeyFn: (data, variables) => apiKeys.itemLoggers(variables.applicationId),
  });
