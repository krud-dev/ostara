import { BaseRO, CrudEntity, CrudEntityTypeHelper } from '../../entity/entity';
import { AxiosResponse } from 'axios';
import { CrudUpdateData, CrudUpdateVariables } from '../../crudUpdate';
import { axiosInstance } from '../../../axiosInstance';

export const crudFrameworkUpdate = async <ResponseRO extends BaseRO, RequestRO = ResponseRO>(
  entity: CrudEntity & CrudEntityTypeHelper<'CrudFramework'>,
  variables: Omit<CrudUpdateVariables<RequestRO>, 'entity'>
): Promise<CrudUpdateData<ResponseRO>> => {
  const { item, id } = variables;

  const result = await axiosInstance.put<
    CrudUpdateData<ResponseRO>,
    AxiosResponse<CrudUpdateData<ResponseRO>>,
    RequestRO
  >(`${entity.path}/${id}`, item);
  return result.data;
};
