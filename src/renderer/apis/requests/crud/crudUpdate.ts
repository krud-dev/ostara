import { CrudMutationOptions, CrudUseMutationResult, CrudVariables, useCrudMutation } from './base/useCrudMutation';
import { getCrudMethods } from './types/crud';
import { BaseRO } from './entity/entity';

export type CrudUpdateVariables<RequestRO> = CrudVariables & { item: RequestRO; id: string };

export type CrudUpdateData<ResponseRO extends BaseRO> = ResponseRO;

export const crudUpdate = async <ResponseRO extends BaseRO, RequestRO = ResponseRO>(
  variables: CrudUpdateVariables<RequestRO>
): Promise<CrudUpdateData<ResponseRO>> => {
  const { entity, ...rest } = variables;
  return await getCrudMethods(entity.type).update(entity, rest);
};

export const useCrudUpdate = <ResponseRO extends BaseRO, RequestRO = ResponseRO>(
  options?: CrudMutationOptions<CrudUpdateData<ResponseRO>, CrudUpdateVariables<RequestRO>>
): CrudUseMutationResult<CrudUpdateData<ResponseRO>, CrudUpdateVariables<RequestRO>> =>
  useCrudMutation(crudUpdate, options);
