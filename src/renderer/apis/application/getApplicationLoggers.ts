import { BaseQueryOptions, BaseUseQueryResult, useBaseQuery } from '../base/useBaseQuery';
import { BaseMutationOptions, BaseUseMutationResult, useBaseMutation } from 'renderer/apis/base/useBaseMutation';
import { apiKeys } from 'renderer/apis/apiKeys';
import { ApplicationLogger } from 'infra/instance/models/logger';

export type EnrichedApplicationLogger = ApplicationLogger & {
  applicationId: string;
};

type Variables = {
  applicationId: string;
};

type Data = EnrichedApplicationLogger[];

export const getApplicationLoggers = async (variables: Variables): Promise<Data> => {
  const result = await window.instance.getApplicationLoggers(variables.applicationId);
  return result.map((logger) => ({ ...logger, applicationId: variables.applicationId }));
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
