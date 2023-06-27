import { BaseRO, CrudEntityCrudFramework } from 'renderer/apis/requests/crud/entity/entity';
import { AxiosResponse } from 'axios';
import { CrudSearchData, CrudSearchVariables } from 'renderer/apis/requests/crud/crudSearch';
import { axiosInstance } from 'renderer/apis/axiosInstance';
import { DynamicModelFilter } from 'common/generated_definitions';
import { DeepPartial } from 'react-hook-form';

export const crudFrameworkSearch = async <ResponseRO extends BaseRO>(
  entity: CrudEntityCrudFramework,
  variables: Omit<CrudSearchVariables, 'entity'>
): Promise<CrudSearchData<ResponseRO>> => {
  const { currentPage = 1, pageSize = 10000, filterFields = [], orders = [] } = variables;

  const result = await axiosInstance.post<
    CrudSearchData<ResponseRO>,
    AxiosResponse<CrudSearchData<ResponseRO>>,
    DeepPartial<DynamicModelFilter> // DeepPartial should be removed once FilterField type is fixed
  >(`${entity.path}/search`, {
    start: (currentPage - 1) * pageSize,
    limit: pageSize,
    filterFields: filterFields,
    orders: orders,
    cacheKey: entity.id,
  });
  return result.data;
};
