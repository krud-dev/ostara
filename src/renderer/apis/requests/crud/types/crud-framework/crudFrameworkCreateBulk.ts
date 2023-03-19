import { CrudEntityCrudFramework } from '../../entity/entity';
import { AxiosResponse } from 'axios';
import { axiosInstance } from '../../../../axiosInstance';
import { CrudCreateBulkData, CrudCreateBulkVariables } from '../../crudCreateBulk';

export const crudFrameworkCreateBulk = async <ResponseRO, RequestRO = ResponseRO>(
  entity: CrudEntityCrudFramework,
  variables: Omit<CrudCreateBulkVariables<RequestRO>, 'entity'>
): Promise<CrudCreateBulkData<ResponseRO>> => {
  const { items } = variables;
  const result = await axiosInstance.post<
    CrudCreateBulkData<ResponseRO>,
    AxiosResponse<CrudCreateBulkData<ResponseRO>>,
    { items: RequestRO[] }
  >(`${entity.path}/bulk`, { items });
  return result.data;
};
