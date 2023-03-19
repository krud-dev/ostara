import {
  MutationFunction,
  useMutation,
  UseMutationOptions,
  UseMutationResult,
  useQueryClient,
} from '@tanstack/react-query';
import { disableGlobalErrorMeta } from '../../useQueryClient';

export type BaseMutationOptions<Data, Variables> = Omit<UseMutationOptions<Data, unknown, Variables>, 'mutationFn'> & {
  refetchNone?: boolean;
  disableGlobalError?: boolean;
  invalidateQueriesKeyFn?: (data: Data, variables: Variables) => unknown[];
  invalidateQueriesKeysFn?: (data: Data, variables: Variables) => unknown[][];
};

export type BaseUseMutationResult<Data, Variables> = UseMutationResult<Data, unknown, Variables>;

export const useBaseMutation = <Data, Variables>(
  mutationFn: MutationFunction<Data, Variables>,
  options?: BaseMutationOptions<Data, Variables>
): BaseUseMutationResult<Data, Variables> => {
  const queryClient = useQueryClient();

  return useMutation<Data, unknown, Variables>(mutationFn, {
    ...options,
    meta: {
      ...options?.meta,
      ...(options?.disableGlobalError ? disableGlobalErrorMeta : undefined),
    },
    onSuccess: (data, variables, context) => {
      options?.onSuccess?.(data, variables, context);

      if (options?.invalidateQueriesKeyFn) {
        queryClient.invalidateQueries(
          options.invalidateQueriesKeyFn(data, variables),
          options?.refetchNone ? { refetchType: 'none' } : undefined
        );
      }

      if (options?.invalidateQueriesKeysFn) {
        for (const key of options.invalidateQueriesKeysFn(data, variables)) {
          queryClient.invalidateQueries(key, options?.refetchNone ? { refetchType: 'none' } : undefined);
        }
      }
    },
  });
};
