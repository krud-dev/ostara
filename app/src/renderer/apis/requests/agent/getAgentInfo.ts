import {
  BaseMutationOptions,
  BaseUseMutationResult,
  useBaseMutation,
} from 'renderer/apis/requests/base/useBaseMutation';
import { BaseQueryOptions, BaseUseQueryResult, useBaseQuery } from 'renderer/apis/requests/base/useBaseQuery';
import { apiKeys } from 'renderer/apis/apiKeys';
import { AgentInfoDTO, Authentication, TestConnectionResponse } from '../../../../common/generated_definitions';
import { axiosInstance } from '../../axiosInstance';
import { AxiosResponse } from 'axios';
import { agentCrudEntity } from 'renderer/apis/requests/crud/entity/entities/agent.crudEntity';

type Variables = { agentId: string };

type Data = AgentInfoDTO;

export const getAgentInfo = async (variables: Variables): Promise<Data> => {
  return (await axiosInstance.get<Data, AxiosResponse<Data>>(`${agentCrudEntity.path}/${variables.agentId}/info`)).data;
};

export const useGetAgentInfo = (
  options?: BaseMutationOptions<Data, Variables>
): BaseUseMutationResult<Data, Variables> => useBaseMutation<Data, Variables>(getAgentInfo, options);

export const useGetAgentInfoQuery = (
  variables: Variables,
  options?: BaseQueryOptions<Data, Variables>
): BaseUseQueryResult<Data> =>
  useBaseQuery<Data, Variables>(apiKeys.itemInfo(variables.agentId), getAgentInfo, variables, options);
