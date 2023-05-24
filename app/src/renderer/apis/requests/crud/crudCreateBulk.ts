import { CrudMutationOptions, CrudUseMutationResult, CrudVariables, useCrudMutation } from './base/useCrudMutation';
import { getCrudMethods } from './types/crud';

export type CrudCreateBulkVariables<RequestRO> = CrudVariables & { items: RequestRO[] };

export type CrudCreateBulkData<ResponseRO> = ResponseRO[];

export const crudCreateBulk = async <ResponseRO, RequestRO = ResponseRO>(
  variables: CrudCreateBulkVariables<RequestRO>
): Promise<CrudCreateBulkData<ResponseRO>> => {
  const { entity, ...rest } = variables;
  return await getCrudMethods(entity.type).createBulk(entity, rest);
};

export const useCrudCreateBulk = <ResponseRO, RequestRO = ResponseRO>(
  options?: CrudMutationOptions<CrudCreateBulkData<ResponseRO>, CrudCreateBulkVariables<RequestRO>>
): CrudUseMutationResult<CrudCreateBulkData<ResponseRO>, CrudCreateBulkVariables<RequestRO>> =>
  useCrudMutation(crudCreateBulk, options);
