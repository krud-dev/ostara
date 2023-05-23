import { BaseQueryOptions, BaseUseQueryResult, useBaseQuery } from '../../base/useBaseQuery';
import {
  BaseMutationOptions,
  BaseUseMutationResult,
  useBaseMutation,
} from 'renderer/apis/requests/base/useBaseMutation';
import { apiKeys } from 'renderer/apis/apiKeys';
import { ApplicationLoggerRO } from '../../../../../common/generated_definitions';
import { axiosInstance } from '../../../axiosInstance';
import { AxiosResponse } from 'axios';

export type EnrichedApplicationLoggerRO = ApplicationLoggerRO & {
  applicationId: string;
  timestamp: number;
};

type Variables = {
  applicationId: string;
};

type Data = EnrichedApplicationLoggerRO[];

export const getApplicationLoggers = async (variables: Variables): Promise<Data> => {
  const result = (
    await axiosInstance.get<ApplicationLoggerRO[], AxiosResponse<ApplicationLoggerRO[]>>(
      `logger/application/${variables.applicationId}`
    )
  ).data;
  const now = new Date().getTime();
  return result.map((logger) => ({ ...logger, applicationId: variables.applicationId, timestamp: now }));
};

export const useGetApplicationLoggers = (
  options?: BaseMutationOptions<Data, Variables>
): BaseUseMutationResult<Data, Variables> => useBaseMutation<Data, Variables>(getApplicationLoggers, options);

export const useGetApplicationLoggersQuery = (
  variables: Variables,
  options?: BaseQueryOptions<Data, Variables>
): BaseUseQueryResult<Data> =>
  useBaseQuery<Data, Variables>(
    apiKeys.itemLoggers(variables.applicationId),
    getApplicationLoggers,
    variables,
    options
  );
