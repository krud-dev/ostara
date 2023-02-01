import { BaseQueryOptions, BaseUseQueryResult, useBaseQuery } from '../base/useBaseQuery';
import { BaseMutationOptions, BaseUseMutationResult, useBaseMutation } from 'renderer/apis/base/useBaseMutation';
import { apiKeys } from 'renderer/apis/apiKeys';
import { InstanceLogger } from 'infra/instance/models/logger';

export type EnrichedInstanceLogger = InstanceLogger & {
  instanceId: string;
};

type Variables = {
  instanceId: string;
};

type Data = EnrichedInstanceLogger[];

export const getInstanceLoggers = async (variables: Variables): Promise<Data> => {
  const result = await window.instance.getInstanceLoggers(variables.instanceId);
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
