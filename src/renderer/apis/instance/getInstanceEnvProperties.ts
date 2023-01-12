import { BaseQueryOptions, BaseUseQueryResult, useBaseQuery } from '../base/useBaseQuery';
import { BaseMutationOptions, BaseUseMutationResult, useBaseMutation } from 'renderer/apis/base/useBaseMutation';
import { apiKeys } from 'renderer/apis/apiKeys';
import { ActuatorProperty } from 'infra/actuator/model/env';
import { chain, toString } from 'lodash';

export type EnvProperty = {
  source: string;
  name: string;
  value: string;
  origin?: string;
  profiles: string[];
};

type Variables = {
  instanceId: string;
};

type Data = EnvProperty[];

export const getInstanceEnvProperties = async (variables: Variables): Promise<Data> => {
  const result = await window.actuator.env(variables.instanceId);
  return chain(result.propertySources)
    .map(
      (source) =>
        chain(source.properties)
          .map<EnvProperty>((value: ActuatorProperty, name: string) => ({
            source: source.name,
            name,
            value: toString(value.value),
            origin: value.origin,
            profiles: result.activeProfiles,
          }))
          .value() || []
    )
    .flatten()
    .value();
};

export const useGetInstanceEnvProperties = (
  options?: BaseMutationOptions<Data, Variables>
): BaseUseMutationResult<Data, Variables> => useBaseMutation<Data, Variables>(getInstanceEnvProperties, options);

export const useGetInstanceEnvPropertiesQuery = (
  variables: Variables,
  options?: BaseQueryOptions<Data, Variables>
): BaseUseQueryResult<Data> =>
  useBaseQuery<Data, Variables>(apiKeys.itemEnv(variables.instanceId), getInstanceEnvProperties, variables, options);
