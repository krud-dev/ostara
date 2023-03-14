import { BaseQueryOptions, BaseUseQueryResult, useBaseQuery } from '../../base/useBaseQuery';
import {
  BaseMutationOptions,
  BaseUseMutationResult,
  useBaseMutation,
} from 'renderer/apis/requests/base/useBaseMutation';
import { apiKeys } from 'renderer/apis/apiKeys';
import { MappingsActuatorResponse$Context$Mappings$Servlet } from '../../../../../common/generated_definitions';
import { getInstanceMappings } from './getInstanceMappings';
import { chain } from 'lodash';

export type EnrichedMappingsServlet = MappingsActuatorResponse$Context$Mappings$Servlet & {
  context: string;
};

type Variables = {
  instanceId: string;
};

type Data = EnrichedMappingsServlet[];

export const getInstanceMappingsServlets = async (variables: Variables): Promise<Data> => {
  const result = await getInstanceMappings(variables);
  return chain(result.contexts)
    .map((context, contextName) => context.mappings.servlets.map((servlet) => ({ ...servlet, context: contextName })))
    .flatten()
    .value();
};

export const useGetInstanceMappingsServlets = (
  options?: BaseMutationOptions<Data, Variables>
): BaseUseMutationResult<Data, Variables> => useBaseMutation<Data, Variables>(getInstanceMappingsServlets, options);

export const useGetInstanceMappingsServletsQuery = (
  variables: Variables,
  options?: BaseQueryOptions<Data, Variables>
): BaseUseQueryResult<Data> =>
  useBaseQuery<Data, Variables>(
    apiKeys.itemMappingsServlets(variables.instanceId),
    getInstanceMappingsServlets,
    variables,
    options
  );
