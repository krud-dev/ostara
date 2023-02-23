import {
  BaseMutationOptions,
  BaseUseMutationResult,
  useBaseMutation,
} from 'renderer/apis/requests/base/useBaseMutation';
import { baseUrl } from '../../../axiosInstance';
import { heapdumpReferenceCrudEntity } from '../../crud/entity/entities/heapdumpReference.crudEntity';
import { InstanceHeapdumpReferenceRO } from '../../../../../common/generated_definitions';

type Variables = {
  reference: InstanceHeapdumpReferenceRO;
};

type Data = void;

export const downloadInstanceHeapdumpReference = async (variables: Variables): Promise<Data> => {
  await window.ui.downloadFile(`${baseUrl}/${heapdumpReferenceCrudEntity.path}/download/${variables.reference.id}`, {
    filename: `heapdump_${variables.reference.creationTime}.${variables.reference.path?.split('.').pop()}`,
    saveAs: true,
    openFolderWhenDone: true,
  });
};

export const useDownloadInstanceHeapdumpReference = (
  options?: BaseMutationOptions<Data, Variables>
): BaseUseMutationResult<Data, Variables> =>
  useBaseMutation<Data, Variables>(downloadInstanceHeapdumpReference, {
    ...options,
  });
