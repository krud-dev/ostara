import { BaseQueryOptions, BaseUseQueryResult, useBaseQuery } from '../../base/useBaseQuery';
import {
  BaseMutationOptions,
  BaseUseMutationResult,
  useBaseMutation,
} from 'renderer/apis/requests/base/useBaseMutation';
import { apiKeys } from 'renderer/apis/apiKeys';
import { axiosInstance } from 'renderer/apis/axiosInstance';
import { AxiosResponse } from 'axios';
import { isNil } from 'lodash';

type Variables = {
  instanceId: string;
  start?: number;
  end?: number;
};

type Data = string;

export const getInstanceLogfile = async (variables: Variables): Promise<Data> => {
  return (
    await axiosInstance.get<Data, AxiosResponse<Data>>(
      `actuator/logfile?instanceId=${variables.instanceId}${
        !isNil(variables.start) ? `&start=${variables.start}` : ''
      }${!isNil(variables.end) ? `&end=${variables.end}` : ''}`
    )
  ).data;
};

export const useGetInstanceLogfile = (
  options?: BaseMutationOptions<Data, Variables>
): BaseUseMutationResult<Data, Variables> => useBaseMutation<Data, Variables>(getInstanceLogfile, options);

export const useGetInstanceLogfileQuery = (
  variables: Variables,
  options?: BaseQueryOptions<Data, Variables>
): BaseUseQueryResult<Data> =>
  useBaseQuery<Data, Variables>(
    apiKeys.itemLogfile(variables.instanceId, variables.start, variables.end),
    getInstanceLogfile,
    variables,
    options
  );
