import {
  BaseMutationOptions,
  BaseUseMutationResult,
  useBaseMutation,
} from 'renderer/apis/requests/base/useBaseMutation';
import { baseUrl } from '../../axiosInstance';

type Variables = {};

type Data = void;

export const exportBackup = async (variables: Variables): Promise<Data> => {
  const now = new Date().getTime();
  await window.ui.downloadFile(`${baseUrl}/backup/exportAll`, {
    filename: `ostara_export_${now}.json`,
    saveAs: true,
    openFolderWhenDone: true,
  });
};

export const useExportBackup = (
  options?: BaseMutationOptions<Data, Variables>
): BaseUseMutationResult<Data, Variables> => useBaseMutation<Data, Variables>(exportBackup, options);
