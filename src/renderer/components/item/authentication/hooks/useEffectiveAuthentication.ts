import { useState } from 'react';
import { useGetApplicationEffectiveAuthentication } from '../../../../apis/requests/application/authentication/getApplicationEffectiveAuthentication';
import { Authentication, EffectiveAuthentication } from '../../../../../common/generated_definitions';
import { useGetFolderEffectiveAuthentication } from '../../../../apis/requests/folder/authentication/getFolderEffectiveAuthentication';
import { useShallowCompareEffect } from 'react-use';

const useEffectiveAuthentication = (options: {
  applicationId?: string;
  folderId?: string;
  authentication?: Authentication;
}): Partial<EffectiveAuthentication> => {
  const [effectiveAuthentication, setEffectiveAuthentication] = useState<Partial<EffectiveAuthentication>>({
    authentication: options.authentication,
  });

  const applicationAuthenticationState = useGetApplicationEffectiveAuthentication({ cacheTime: 0 });
  const folderAuthenticationState = useGetFolderEffectiveAuthentication({ cacheTime: 0 });

  useShallowCompareEffect(() => {
    if (options.authentication && options.authentication.type !== 'inherit') {
      setEffectiveAuthentication({ authentication: options.authentication });
    } else if (options.applicationId) {
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
  }, [options.authentication, options.applicationId, options.folderId]);

  return effectiveAuthentication;
};
export default useEffectiveAuthentication;
