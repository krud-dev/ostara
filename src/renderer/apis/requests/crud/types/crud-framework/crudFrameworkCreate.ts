import { CrudEntityCrudFramework } from '../../entity/entity';
import { AxiosResponse } from 'axios';
import { CrudCreateData, CrudCreateVariables } from '../../crudCreate';
import { axiosInstance } from '../../../../axiosInstance';

export const crudFrameworkCreate = async <ResponseRO, RequestRO = ResponseRO>(
  entity: CrudEntityCrudFramework,
  variables: Omit<CrudCreateVariables<RequestRO>, 'entity'>
): Promise<CrudCreateData<ResponseRO>> => {
  const { item } = variables;
  const result = await axiosInstance.post<
    CrudCreateData<ResponseRO>,
    AxiosResponse<CrudCreateData<ResponseRO>>,
    RequestRO
  >(`${entity.path}`, item);
  return result.data;
};
