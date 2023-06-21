import {
  BaseMutationOptions,
  BaseUseMutationResult,
  useBaseMutation,
} from 'renderer/apis/requests/base/useBaseMutation';
import { baseUrl } from 'renderer/apis/axiosInstance';
import { snakeCase } from 'lodash';

type Variables = {
  instanceId: string;
  instanceName: string;
};

type Data = void;

export const downloadInstanceLogfile = async (variables: Variables): Promise<Data> => {
  await window.ui.downloadFile(`${baseUrl}/actuator/logfile?instanceId=${variables.instanceId}`, {
    filename: `log_${encodeURIComponent(snakeCase(variables.instanceName))}_${new Date().getTime()}.log`,
    saveAs: true,
    openFolderWhenDone: true,
  });
};

export const useDownloadInstanceLogfile = (
  options?: BaseMutationOptions<Data, Variables>
): BaseUseMutationResult<Data, Variables> =>
  useBaseMutation<Data, Variables>(downloadInstanceLogfile, {
    ...options,
  });
