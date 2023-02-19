import { CrudMutationOptions, CrudUseMutationResult, CrudVariables, useCrudMutation } from './base/useCrudMutation';
import { getCrudMethods } from './types/crud';

export type CrudDeleteVariables = CrudVariables & { id: string };

export type CrudDeleteData = void;

export const crudDelete = async (variables: CrudDeleteVariables): Promise<CrudDeleteData> => {
  const { entity, ...rest } = variables;
  return await getCrudMethods(entity.type).delete(entity, rest);
};

export const useCrudDelete = (
  options?: CrudMutationOptions<CrudDeleteData, CrudDeleteVariables>
): CrudUseMutationResult<CrudDeleteData, CrudDeleteVariables> => useCrudMutation(crudDelete, options);
