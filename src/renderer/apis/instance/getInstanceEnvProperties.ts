import { BaseQueryOptions, BaseUseQueryResult, useBaseQuery } from '../base/useBaseQuery';
import { BaseMutationOptions, BaseUseMutationResult, useBaseMutation } from 'renderer/apis/base/useBaseMutation';
import { apiKeys } from 'renderer/apis/apiKeys';
import { chain, toString } from 'lodash';
import { getInstanceEnv } from './getInstanceEnv';
import { EnvPropertyActuatorResponse$PropertySource$Property } from '../../../common/generated_definitions';

export type EnvProperty = {
  source: string;
  name: string;
  value: string;
  origin?: string;
};

type Variables = {
  instanceId: string;
};

type Data = EnvProperty[];

export const getInstanceEnvProperties = async (variables: Variables): Promise<Data> => {
  const result = await getInstanceEnv({ instanceId: variables.instanceId });
  return chain(result.propertySources)
    .map(
      (source) =>
        chain(source.properties)
          .map<EnvProperty>((value: EnvPropertyActuatorResponse$PropertySource$Property, name: string) => ({
            source: source.name,
            name,
            value: toString(value.value),
            origin: value.origin,
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
  useBaseQuery<Data, Variables>(
    apiKeys.itemEnvProperties(variables.instanceId),
    getInstanceEnvProperties,
    variables,
    options
  );
