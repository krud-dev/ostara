import { BaseQueryOptions, BaseUseQueryResult, useBaseQuery } from 'renderer/apis/requests/base/useBaseQuery';
import {
  BaseMutationOptions,
  BaseUseMutationResult,
  useBaseMutation,
} from 'renderer/apis/requests/base/useBaseMutation';
import { apiKeys } from 'renderer/apis/apiKeys';
import { EffectiveAuthentication } from 'common/generated_definitions';
import { axiosInstance } from 'renderer/apis/axiosInstance';
import { AxiosResponse } from 'axios';

type Variables = {
  agentId: string;
};

type Data = EffectiveAuthentication;

export const getAgentEffectiveAuthentication = async (variables: Variables): Promise<Data> => {
  return (await axiosInstance.get<Data, AxiosResponse<Data>>(`agents/${variables.agentId}/authentication/effective`))
    .data;
};

export const useGetAgentEffectiveAuthentication = (
  options?: BaseMutationOptions<Data, Variables>
): BaseUseMutationResult<Data, Variables> => useBaseMutation<Data, Variables>(getAgentEffectiveAuthentication, options);

export const useGetAgentEffectiveAuthenticationQuery = (
  variables: Variables,
  options?: BaseQueryOptions<Data, Variables>
): BaseUseQueryResult<Data> =>
  useBaseQuery<Data, Variables>(
    apiKeys.itemEffectiveAuthentication(variables.agentId),
    getAgentEffectiveAuthentication,
    variables,
    options
  );
