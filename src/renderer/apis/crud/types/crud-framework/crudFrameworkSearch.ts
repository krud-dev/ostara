import { BaseRO, CrudEntity, CrudEntityTypeHelper } from '../../entity/entity';
import { AxiosResponse } from 'axios';
import { CrudSearchData, CrudSearchVariables } from '../../crudSearch';
import { axiosInstance } from '../../../axiosInstance';
import { DynamicModelFilter } from '../../../../../common/generated_definitions';

export const crudFrameworkSearch = async <ResponseRO extends BaseRO>(
  entity: CrudEntity & CrudEntityTypeHelper<'CrudFramework'>,
  variables: Omit<CrudSearchVariables, 'entity'>
): Promise<CrudSearchData<ResponseRO>> => {
  const { currentPage = 1, pageSize = 1000, filterFields = [], orders = [] } = variables;

  const result = await axiosInstance.post<
    CrudSearchData<ResponseRO>,
    AxiosResponse<CrudSearchData<ResponseRO>>,
    DynamicModelFilter
  >(`${entity.path}/search`, {
    start: (currentPage - 1) * pageSize,
    limit: pageSize,
    filterFields: filterFields,
    orders: orders,
    cacheKey: entity.id,
  });
  return result.data;
};
