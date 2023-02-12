import { CrudEntityCrudFramework } from '../../entity/entity';
import { AxiosResponse } from 'axios';
import { CrudDeleteData, CrudDeleteVariables } from '../../crudDelete';
import { axiosInstance } from '../../../axiosInstance';

export const crudFrameworkDelete = async (
  entity: CrudEntityCrudFramework,
  variables: Omit<CrudDeleteVariables, 'entity'>
): Promise<CrudDeleteData> => {
  const { id } = variables;
  await axiosInstance.delete<unknown, AxiosResponse<unknown>>(`${entity.path}/${id}`);
};
