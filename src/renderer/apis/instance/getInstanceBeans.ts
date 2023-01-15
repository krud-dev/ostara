import { BaseQueryOptions, BaseUseQueryResult, useBaseQuery } from '../base/useBaseQuery';
import { BaseMutationOptions, BaseUseMutationResult, useBaseMutation } from 'renderer/apis/base/useBaseMutation';
import { apiKeys } from 'renderer/apis/apiKeys';
import { ActuatorBean } from 'infra/actuator/model/beans';
import { chain, map } from 'lodash';

export type InstanceBean = ActuatorBean & {
  name: string;
};

type Variables = {
  instanceId: string;
};

type Data = InstanceBean[];

export const getInstanceBeans = async (variables: Variables): Promise<Data> => {
  const result = await window.actuator.beans(variables.instanceId);
  return chain(result.contexts)
    .values()
    .map((beansMap) => beansMap.beans)
    .map<InstanceBean[]>((beansMap) => map(beansMap, (bean, name) => ({ ...bean, name })))
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
