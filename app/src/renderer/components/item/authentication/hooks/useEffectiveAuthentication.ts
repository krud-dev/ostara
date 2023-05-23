import { useEffect, useState } from 'react';
import { useGetApplicationEffectiveAuthentication } from '../../../../apis/requests/application/authentication/getApplicationEffectiveAuthentication';
import { EffectiveAuthentication } from '../../../../../common/generated_definitions';
import { useGetFolderEffectiveAuthentication } from '../../../../apis/requests/folder/authentication/getFolderEffectiveAuthentication';

const useEffectiveAuthentication = (options: {
  applicationId?: string;
  folderId?: string;
}): Partial<EffectiveAuthentication> => {
  const [effectiveAuthentication, setEffectiveAuthentication] = useState<Partial<EffectiveAuthentication>>({});

  const applicationAuthenticationState = useGetApplicationEffectiveAuthentication({ cacheTime: 0 });
  const folderAuthenticationState = useGetFolderEffectiveAuthentication({ cacheTime: 0 });

  useEffect(() => {
    if (options.applicationId) {
      (async () => {
        try {
          const result = await applicationAuthenticationState.mutateAsync({ applicationId: options.applicationId! });
          setEffectiveAuthentication(result);
        } catch (e) {}
      })();
    } else if (options.folderId) {
      (async () => {
        try {
          const result = await folderAuthenticationState.mutateAsync({ folderId: options.folderId! });
          setEffectiveAuthentication(result);
        } catch (e) {}
      })();
    } else {
      setEffectiveAuthentication({ authentication: { type: 'none' } });
    }
  }, [options.applicationId, options.folderId]);

  return effectiveAuthentication;
};
export default useEffectiveAuthentication;
