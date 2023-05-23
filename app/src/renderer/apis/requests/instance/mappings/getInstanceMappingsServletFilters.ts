import { BaseQueryOptions, BaseUseQueryResult, useBaseQuery } from '../../base/useBaseQuery';
import {
  BaseMutationOptions,
  BaseUseMutationResult,
  useBaseMutation,
} from 'renderer/apis/requests/base/useBaseMutation';
import { apiKeys } from 'renderer/apis/apiKeys';
import { MappingsActuatorResponse$Context$Mappings$ServletFilter } from '../../../../../common/generated_definitions';
import { getInstanceMappings } from './getInstanceMappings';
import { chain } from 'lodash';

export type EnrichedMappingsServletFilter = MappingsActuatorResponse$Context$Mappings$ServletFilter & {
  context: string;
};

type Variables = {
  instanceId: string;
};

type Data = EnrichedMappingsServletFilter[];

export const getInstanceMappingsServletFilters = async (variables: Variables): Promise<Data> => {
  const result = await getInstanceMappings(variables);
  return chain(result.contexts)
    .map((context, contextName) =>
      context.mappings.servletFilters.map((servlet) => ({
        ...servlet,
        context: contextName,
      }))
    )
    .flatten()
    .value();
};

export const useGetInstanceMappingsServletFilters = (
  options?: BaseMutationOptions<Data, Variables>
): BaseUseMutationResult<Data, Variables> =>
  useBaseMutation<Data, Variables>(getInstanceMappingsServletFilters, options);

export const useGetInstanceMappingsServletFiltersQuery = (
  variables: Variables,
  options?: BaseQueryOptions<Data, Variables>
): BaseUseQueryResult<Data> =>
  useBaseQuery<Data, Variables>(
    apiKeys.itemMappingsServletFilters(variables.instanceId),
    getInstanceMappingsServletFilters,
    variables,
    options
  );
