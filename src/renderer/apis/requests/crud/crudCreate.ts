import { CrudMutationOptions, CrudUseMutationResult, CrudVariables, useCrudMutation } from './base/useCrudMutation';
import { getCrudMethods } from './types/crud';

export type CrudCreateVariables<RequestRO> = CrudVariables & { item: RequestRO };

export type CrudCreateData<ResponseRO> = ResponseRO;

export const crudCreate = async <ResponseRO, RequestRO = ResponseRO>(
  variables: CrudCreateVariables<RequestRO>
): Promise<CrudCreateData<ResponseRO>> => {
  const { entity, ...rest } = variables;
  return await getCrudMethods(entity.type).create(entity, rest);
};

export const useCrudCreate = <ResponseRO, RequestRO = ResponseRO>(
  options?: CrudMutationOptions<CrudCreateData<ResponseRO>, CrudCreateVariables<RequestRO>>
): CrudUseMutationResult<CrudCreateData<ResponseRO>, CrudCreateVariables<RequestRO>> =>
  useCrudMutation(crudCreate, options);
