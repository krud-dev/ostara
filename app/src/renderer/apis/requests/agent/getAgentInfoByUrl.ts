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

type Variables = { agentUrl: string };

type Data = AgentInfoDTO;

export const getAgentInfoByUrl = async (variables: Variables): Promise<Data> => {
  return (await axiosInstance.get<Data, AxiosResponse<Data>>(`${agentCrudEntity.path}/infoForUrl`)).data;
};

export const useGetAgentInfoByUrl = (
  options?: BaseMutationOptions<Data, Variables>
): BaseUseMutationResult<Data, Variables> => useBaseMutation<Data, Variables>(getAgentInfoByUrl, options);

export const useGetAgentInfoByUrlQuery = (
  variables: Variables,
  options?: BaseQueryOptions<Data, Variables>
): BaseUseQueryResult<Data> =>
  useBaseQuery<Data, Variables>(apiKeys.connectionByUrl(variables.agentUrl), getAgentInfoByUrl, variables, options);
