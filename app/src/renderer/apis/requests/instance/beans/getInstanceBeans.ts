import { BaseQueryOptions, BaseUseQueryResult, useBaseQuery } from '../../base/useBaseQuery';
import {
  BaseMutationOptions,
  BaseUseMutationResult,
  useBaseMutation,
} from 'renderer/apis/requests/base/useBaseMutation';
import { apiKeys } from 'renderer/apis/apiKeys';
import { chain, map } from 'lodash';
import { axiosInstance } from '../../../axiosInstance';
import { AxiosResponse } from 'axios';
import { BeansActuatorResponse, BeansActuatorResponse$Context$Bean } from '../../../../../common/generated_definitions';

export type InstanceBean = BeansActuatorResponse$Context$Bean & {
  name: string;
  shortName: string;
  package: string;
};

type Variables = {
  instanceId: string;
};

type Data = InstanceBean[];

export const getInstanceBeans = async (variables: Variables): Promise<Data> => {
  const result = (
    await axiosInstance.get<BeansActuatorResponse, AxiosResponse<BeansActuatorResponse>>(
      `actuator/beans?instanceId=${variables.instanceId}`
    )
  ).data;
  return chain(result.contexts)
    .values()
    .map((beansMap) => beansMap.beans)
    .map<InstanceBean[]>((beansMap) =>
      map(beansMap, (bean, name) => {
        const index = bean.type.lastIndexOf('.');
        const shortName = index > 0 ? bean.type.substring(index + 1) : name;
        const typePackage = index > 0 ? bean.type.substring(0, index) : 'default';
        return { ...bean, name, shortName, package: typePackage };
      })
    )
    .flatten()
    .value();
};

export const useGetInstanceBeans = (
  options?: BaseMutationOptions<Data, Variables>
): BaseUseMutationResult<Data, Variables> => useBaseMutation<Data, Variables>(getInstanceBeans, options);

export const useGetInstanceBeansQuery = (
  variables: Variables,
  options?: BaseQueryOptions<Data, Variables>
): BaseUseQueryResult<Data> =>
  useBaseQuery<Data, Variables>(apiKeys.itemBeans(variables.instanceId), getInstanceBeans, variables, options);
