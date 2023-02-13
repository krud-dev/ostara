import { BaseQueryOptions, BaseUseQueryResult, useBaseQuery } from '../base/useBaseQuery';
import { BaseMutationOptions, BaseUseMutationResult, useBaseMutation } from 'renderer/apis/base/useBaseMutation';
import { apiKeys } from 'renderer/apis/apiKeys';
import { InstanceLoggerRO } from '../../../common/generated_definitions';
import { axiosInstance } from '../axiosInstance';
import { AxiosResponse } from 'axios';

export type EnrichedInstanceLoggerRO = InstanceLoggerRO & {
  instanceId: string;
};

type Variables = {
  instanceId: string;
};

type Data = EnrichedInstanceLoggerRO[];

export const getInstanceLoggers = async (variables: Variables): Promise<Data> => {
  const result = (
    await axiosInstance.get<InstanceLoggerRO[], AxiosResponse<InstanceLoggerRO[]>>(
      `logger/instance/${variables.instanceId}`
    )
  ).data;
  return result.map((logger) => ({ ...logger, instanceId: variables.instanceId }));
};

export const useGetInstanceLoggers = (
  options?: BaseMutationOptions<Data, Variables>
): BaseUseMutationResult<Data, Variables> => useBaseMutation<Data, Variables>(getInstanceLoggers, options);

export const useGetInstanceLoggersQuery = (
  variables: Variables,
  options?: BaseQueryOptions<Data, Variables>
): BaseUseQueryResult<Data> =>
  useBaseQuery<Data, Variables>(apiKeys.itemLoggers(variables.instanceId), getInstanceLoggers, variables, options);
