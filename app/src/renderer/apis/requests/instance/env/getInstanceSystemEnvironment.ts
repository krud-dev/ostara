import { BaseQueryOptions, BaseUseQueryResult, useBaseQuery } from '../../base/useBaseQuery';
import {
  BaseMutationOptions,
  BaseUseMutationResult,
  useBaseMutation,
} from 'renderer/apis/requests/base/useBaseMutation';
import { apiKeys } from 'renderer/apis/apiKeys';
import { chain } from 'lodash';
import {
  InstanceSystemEnvironmentRO,
  InstanceSystemEnvironmentRO$RedactionLevel,
} from '../../../../../common/generated_definitions';
import { axiosInstance } from '../../../axiosInstance';
import { AxiosResponse } from 'axios';

export type SystemEnvironmentProperty = {
  name: string;
  value: string;
  redactionLevel: InstanceSystemEnvironmentRO$RedactionLevel;
};

type Variables = {
  instanceId: string;
};

type Data = SystemEnvironmentProperty[];

export const getInstanceSystemEnvironment = async (variables: Variables): Promise<Data> => {
  const result = (
    await axiosInstance.get<InstanceSystemEnvironmentRO, AxiosResponse<InstanceSystemEnvironmentRO>>(
      `instances/${variables.instanceId}/systemEnvironment`
    )
  ).data;
  return chain(result.properties)
    .map((value, name) => ({ name, value, redactionLevel: result.redactionLevel }))
    .value();
};

export const useGetInstanceSystemEnvironment = (
  options?: BaseMutationOptions<Data, Variables>
): BaseUseMutationResult<Data, Variables> => useBaseMutation<Data, Variables>(getInstanceSystemEnvironment, options);

export const useGetInstanceSystemEnvironmentQuery = (
  variables: Variables,
  options?: BaseQueryOptions<Data, Variables>
): BaseUseQueryResult<Data> =>
  useBaseQuery<Data, Variables>(
    apiKeys.itemSystemEnvironment(variables.instanceId),
    getInstanceSystemEnvironment,
    variables,
    options
  );
