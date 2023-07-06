import {
  BaseMutationOptions,
  BaseUseMutationResult,
  useBaseMutation,
} from 'renderer/apis/requests/base/useBaseMutation';
import { axiosInstance } from 'renderer/apis/axiosInstance';
import { AxiosResponse } from 'axios';
import { apiKeys } from 'renderer/apis/apiKeys';
import { AgentHealthDTO } from 'common/generated_definitions';
import { BaseQueryOptions, BaseUseQueryResult, useBaseQuery } from '../../base/useBaseQuery';

type Variables = {
  agentId: string;
};

type Data = AgentHealthDTO;

export const updateAgentHealth = async (variables: Variables): Promise<Data> => {
  return (await axiosInstance.put<Data, AxiosResponse<Data>>(`agents/updateHealth/${variables.agentId}`)).data;
};

export const useUpdateAgentHealth = (
  options?: BaseMutationOptions<Data, Variables>
): BaseUseMutationResult<Data, Variables> => useBaseMutation<Data, Variables>(updateAgentHealth, options);

export const useUpdateAgentHealthQuery = (
  variables: Variables,
  options?: BaseQueryOptions<Data, Variables>
): BaseUseQueryResult<Data> =>
  useBaseQuery<Data, Variables>(apiKeys.agentHealth(variables.agentId), updateAgentHealth, variables, options);
