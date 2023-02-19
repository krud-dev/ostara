import {
  MutationFunction,
  useMutation,
  UseMutationOptions,
  UseMutationResult,
  useQueryClient,
} from '@tanstack/react-query';

export type BaseMutationOptions<Data, Variables> = Omit<UseMutationOptions<Data, unknown, Variables>, 'mutationFn'> & {
  refetchNone?: boolean;
  invalidateQueriesKeyFn?: (data: Data, variables: Variables) => unknown[];
};

export type BaseUseMutationResult<Data, Variables> = UseMutationResult<Data, unknown, Variables>;

export const useBaseMutation = <Data, Variables>(
  mutationFn: MutationFunction<Data, Variables>,
  options?: BaseMutationOptions<Data, Variables>
): BaseUseMutationResult<Data, Variables> => {
  const queryClient = useQueryClient();

  return useMutation<Data, unknown, Variables>(mutationFn, {
    ...options,
    onSuccess: (data, variables) => {
      if (options?.invalidateQueriesKeyFn) {
        queryClient.invalidateQueries(
          options.invalidateQueriesKeyFn(data, variables),
          options?.refetchNone ? { refetchType: 'none' } : undefined
        );
      }
    },
  });
};
