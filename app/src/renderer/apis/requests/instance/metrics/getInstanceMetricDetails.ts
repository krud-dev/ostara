import { BaseQueryOptions, BaseUseQueryResult, useBaseQuery } from '../../base/useBaseQuery';
import {
  BaseMutationOptions,
  BaseUseMutationResult,
  useBaseMutation,
} from 'renderer/apis/requests/base/useBaseMutation';
import { apiKeys } from 'renderer/apis/apiKeys';
import { MetricActuatorResponse } from '../../../../../common/generated_definitions';
import { axiosInstance } from '../../../axiosInstance';
import { AxiosResponse } from 'axios';

type Variables = {
  instanceId: string;
  name: string;
  tags?: { [key: string]: string };
};

type Data = MetricActuatorResponse;

export const getInstanceMetricDetails = async (variables: Variables): Promise<Data> => {
  return (
    await axiosInstance.post<Data, AxiosResponse<Data>, { [key: string]: string } | undefined>(
      `actuator/metrics/${variables.name}?instanceId=${variables.instanceId}`,
      variables.tags
    )
  ).data;
};

export const useGetInstanceMetricDetails = (
  options?: BaseMutationOptions<Data, Variables>
): BaseUseMutationResult<Data, Variables> => useBaseMutation<Data, Variables>(getInstanceMetricDetails, options);

export const useGetInstanceMetricDetailsQuery = (
  variables: Variables,
  options?: BaseQueryOptions<Data, Variables>
): BaseUseQueryResult<Data> =>
  useBaseQuery<Data, Variables>(
    apiKeys.itemMetricDetails(variables.instanceId, variables.name, variables.tags),
    getInstanceMetricDetails,
    variables,
    options
  );
