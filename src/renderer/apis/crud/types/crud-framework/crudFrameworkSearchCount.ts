import { CrudEntityCrudFramework } from '../../entity/entity';
import { AxiosResponse } from 'axios';
import { CrudSearchCountData, CrudSearchCountVariables } from '../../crudSearchCount';
import { FilterField } from '../../../../../common/generated_definitions';
import { axiosInstance } from '../../../axiosInstance';

export const crudFrameworkSearchCount = async (
  entity: CrudEntityCrudFramework,
  variables: Omit<CrudSearchCountVariables, 'entity'>
): Promise<CrudSearchCountData> => {
  const { filterFields = [] } = variables;

  const result = await axiosInstance.post<
    CrudSearchCountData,
    AxiosResponse<CrudSearchCountData>,
    { filterFields?: FilterField[] }
  >(`${entity.path}/index/count`, {
    filterFields: filterFields,
  });
  return result.data;
};
