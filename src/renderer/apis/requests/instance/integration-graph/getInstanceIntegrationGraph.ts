import { BaseQueryOptions, BaseUseQueryResult, useBaseQuery } from '../../base/useBaseQuery';
import {
  BaseMutationOptions,
  BaseUseMutationResult,
  useBaseMutation,
} from 'renderer/apis/requests/base/useBaseMutation';
import { apiKeys } from 'renderer/apis/apiKeys';
import { FlywayActuatorResponse, IntegrationGraphActuatorResponse } from '../../../../../common/generated_definitions';
import { axiosInstance } from '../../../axiosInstance';
import { AxiosResponse } from 'axios';

type Variables = {
  instanceId: string;
};

type Data = IntegrationGraphActuatorResponse;

export const getInstanceIntegrationGraph = async (variables: Variables): Promise<Data> => {
  return (
    await axiosInstance.get<Data, AxiosResponse<Data>>(`actuator/integrationgraph?instanceId=${variables.instanceId}`)
  ).data;
};

export const useGetInstanceIntegrationGraph = (
  options?: BaseMutationOptions<Data, Variables>
): BaseUseMutationResult<Data, Variables> => useBaseMutation<Data, Variables>(getInstanceIntegrationGraph, options);

export const useGetInstanceIntegrationGraphQuery = (
  variables: Variables,
  options?: BaseQueryOptions<Data, Variables>
): BaseUseQueryResult<Data> =>
  useBaseQuery<Data, Variables>(
    apiKeys.itemIntegrationGraph(variables.instanceId),
    getInstanceIntegrationGraph,
    variables,
    options
  );
