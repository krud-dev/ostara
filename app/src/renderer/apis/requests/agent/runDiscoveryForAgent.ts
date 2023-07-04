import {
  BaseMutationOptions,
  BaseUseMutationResult,
  useBaseMutation,
} from 'renderer/apis/requests/base/useBaseMutation';
import { axiosInstance } from '../../axiosInstance';
import { AxiosResponse } from 'axios';
import { agentCrudEntity } from 'renderer/apis/requests/crud/entity/entities/agent.crudEntity';

type Variables = { agentId: string };

type Data = void;

export const runDiscoveryForAgent = async (variables: Variables): Promise<Data> => {
  return (
    await axiosInstance.post<Data, AxiosResponse<Data>, undefined>(
      `${agentCrudEntity.path}/runDiscoveryForAgent`,
      undefined,
      {
        params: {
          agentId: variables.agentId,
        },
      }
    )
  ).data;
};

export const useRunDiscoveryForAgent = (
  options?: BaseMutationOptions<Data, Variables>
): BaseUseMutationResult<Data, Variables> => useBaseMutation<Data, Variables>(runDiscoveryForAgent, options);
