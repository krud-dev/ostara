import { BaseQueryOptions, BaseUseQueryResult, useBaseQuery } from '../../base/useBaseQuery';
import {
  BaseMutationOptions,
  BaseUseMutationResult,
  useBaseMutation,
} from 'renderer/apis/requests/base/useBaseMutation';
import { apiKeys } from 'renderer/apis/apiKeys';
import { MappingsActuatorResponse$Context$Mappings$DispatcherServletOrHandler } from '../../../../../common/generated_definitions';
import { getInstanceMappings } from './getInstanceMappings';
import { chain } from 'lodash';

export type EnrichedMappingsDispatcherServletOrHandler =
  MappingsActuatorResponse$Context$Mappings$DispatcherServletOrHandler & {
    context: string;
    name: string;
    method?: string;
    url?: string;
    produce?: string;
  };

export const parseServletOrHandler = (
  servletOrHandler: MappingsActuatorResponse$Context$Mappings$DispatcherServletOrHandler,
  contextName: string,
  servletName: string
): EnrichedMappingsDispatcherServletOrHandler => {
  const regex = /{(?:(\w+) )? ?\[?([^\]]*)\]?(?:,? produces \[?([^\]]*)\]?)?}/;
  const match = servletOrHandler.predicate.match(regex);
  const [, method = '', url = '', produce = ''] = match || ['', '', servletOrHandler.predicate, ''];
  return {
    ...servletOrHandler,
    context: contextName,
    name: servletName,
    method: method,
    url: url,
    produce: produce,
  };
};

type Variables = {
  instanceId: string;
};

type Data = EnrichedMappingsDispatcherServletOrHandler[];

export const getInstanceMappingsDispatcherServlets = async (variables: Variables): Promise<Data> => {
  const result = await getInstanceMappings(variables);
  return chain(result.contexts)
    .map((context, contextName) =>
      chain(context.mappings.dispatcherServlets)
        .map((dispatcherServlets, servletName) =>
          dispatcherServlets.map((servletOrHandler) =>
            parseServletOrHandler(servletOrHandler, contextName, servletName)
          )
        )
        .flatten()
        .value()
    )
    .flatten()
    .value();
};

export const useGetInstanceMappingsDispatcherServlets = (
  options?: BaseMutationOptions<Data, Variables>
): BaseUseMutationResult<Data, Variables> =>
  useBaseMutation<Data, Variables>(getInstanceMappingsDispatcherServlets, options);

export const useGetInstanceMappingsDispatcherServletsQuery = (
  variables: Variables,
  options?: BaseQueryOptions<Data, Variables>
): BaseUseQueryResult<Data> =>
  useBaseQuery<Data, Variables>(
    apiKeys.itemMappingsDispatcherServlets(variables.instanceId),
    getInstanceMappingsDispatcherServlets,
    variables,
    options
  );
