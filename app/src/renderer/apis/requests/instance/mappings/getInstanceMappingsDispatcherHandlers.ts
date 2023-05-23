import { BaseQueryOptions, BaseUseQueryResult, useBaseQuery } from '../../base/useBaseQuery';
import {
  BaseMutationOptions,
  BaseUseMutationResult,
  useBaseMutation,
} from 'renderer/apis/requests/base/useBaseMutation';
import { apiKeys } from 'renderer/apis/apiKeys';
import { getInstanceMappings } from './getInstanceMappings';
import { chain } from 'lodash';
import {
  EnrichedMappingsDispatcherServletOrHandler,
  parseServletOrHandler,
} from './getInstanceMappingsDispatcherServlets';

type Variables = {
  instanceId: string;
};

type Data = EnrichedMappingsDispatcherServletOrHandler[];

export const getInstanceMappingsDispatcherHandlers = async (variables: Variables): Promise<Data> => {
  const result = await getInstanceMappings(variables);
  return chain(result.contexts)
    .map((context, contextName) =>
      chain(context.mappings.dispatcherHandlers)
        .map((dispatcherHandlers, servletName) =>
          dispatcherHandlers.map((servletOrHandler) =>
            parseServletOrHandler(servletOrHandler, contextName, servletName)
          )
        )
        .flatten()
        .value()
    )
    .flatten()
    .value();
};

export const useGetInstanceMappingsDispatcherHandlers = (
  options?: BaseMutationOptions<Data, Variables>
): BaseUseMutationResult<Data, Variables> =>
  useBaseMutation<Data, Variables>(getInstanceMappingsDispatcherHandlers, options);

export const useGetInstanceMappingsDispatcherHandlersQuery = (
  variables: Variables,
  options?: BaseQueryOptions<Data, Variables>
): BaseUseQueryResult<Data> =>
  useBaseQuery<Data, Variables>(
    apiKeys.itemMappingsDispatcherHandlers(variables.instanceId),
    getInstanceMappingsDispatcherHandlers,
    variables,
    options
  );
