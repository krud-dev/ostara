import { BaseQueryOptions, BaseUseQueryResult, useBaseQuery } from '../../base/useBaseQuery';
import {
  BaseMutationOptions,
  BaseUseMutationResult,
  useBaseMutation,
} from 'renderer/apis/requests/base/useBaseMutation';
import { apiKeys } from 'renderer/apis/apiKeys';
import { chain } from 'lodash';
import { InstanceSystemPropertiesRO } from '../../../../../common/generated_definitions';
import { axiosInstance } from '../../../axiosInstance';
import { AxiosResponse } from 'axios';

export type SystemProperty = {
  name: string;
  value: string;
};

type Variables = {
  instanceId: string;
};

type Data = SystemProperty[];

export const getInstanceSystemProperties = async (variables: Variables): Promise<Data> => {
  const result = (
    await axiosInstance.get<InstanceSystemPropertiesRO, AxiosResponse<InstanceSystemPropertiesRO>>(
      `instances/${variables.instanceId}/systemProperties`
    )
  ).data;
  return chain(result.properties)
    .map((value, name) => ({ name, value }))
    .value();
};

export const useGetInstanceSystemProperties = (
  options?: BaseMutationOptions<Data, Variables>
): BaseUseMutationResult<Data, Variables> => useBaseMutation<Data, Variables>(getInstanceSystemProperties, options);

export const useGetInstanceSystemPropertiesQuery = (
  variables: Variables,
  options?: BaseQueryOptions<Data, Variables>
): BaseUseQueryResult<Data> =>
  useBaseQuery<Data, Variables>(
    apiKeys.itemSystemProperties(variables.instanceId),
    getInstanceSystemProperties,
    variables,
    options
  );
