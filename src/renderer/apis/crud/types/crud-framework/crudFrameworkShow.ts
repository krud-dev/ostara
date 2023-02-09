import { BaseRO, CrudEntity, CrudEntityTypeHelper } from '../../entity/entity';
import { AxiosResponse } from 'axios';
import { CrudShowData, CrudShowVariables } from '../../crudShow';
import { axiosInstance } from '../../../axiosInstance';

export const crudFrameworkShow = async <ResponseRO extends BaseRO>(
  entity: CrudEntity & CrudEntityTypeHelper<'CrudFramework'>,
  variables: Omit<CrudShowVariables, 'entity'>
): Promise<CrudShowData<ResponseRO>> => {
  const { id } = variables;

  const result = await axiosInstance.get<CrudShowData<ResponseRO>, AxiosResponse<CrudShowData<ResponseRO>>>(
    `${entity.path}/${id}`
  );
  return result.data;
};
