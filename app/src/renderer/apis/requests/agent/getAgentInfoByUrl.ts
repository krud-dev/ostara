import {
  BaseMutationOptions,
  BaseUseMutationResult,
  useBaseMutation,
} from 'renderer/apis/requests/base/useBaseMutation';
import { BaseQueryOptions, BaseUseQueryResult, useBaseQuery } from 'renderer/apis/requests/base/useBaseQuery';
import { apiKeys } from 'renderer/apis/apiKeys';
import {
  AgentGetInfoRequestDTO,
  AgentInfoDTO,
  Authentication,
  TestConnectionResponse,
} from '../../../../common/generated_definitions';
import { axiosInstance } from '../../axiosInstance';
import { AxiosResponse } from 'axios';
import { agentCrudEntity } from 'renderer/apis/requests/crud/entity/entities/agent.crudEntity';

type Variables = { request: AgentGetInfoRequestDTO };

type Data = AgentInfoDTO;

export const getAgentInfoByUrl = async (variables: Variables): Promise<Data> => {
  return (
    await axiosInstance.post<Data, AxiosResponse<Data>, AgentGetInfoRequestDTO>(
      `${agentCrudEntity.path}/infoForUrl`,
      variables.request
    )
  ).data;
};

export const useGetAgentInfoByUrl = (
  options?: BaseMutationOptions<Data, Variables>
): BaseUseMutationResult<Data, Variables> => useBaseMutation<Data, Variables>(getAgentInfoByUrl, options);
