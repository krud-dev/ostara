import { useEffect, useState } from 'react';
import { useGetApplicationEffectiveAuthentication } from 'renderer/apis/requests/application/authentication/getApplicationEffectiveAuthentication';
import { EffectiveAuthentication } from 'common/generated_definitions';
import { useGetFolderEffectiveAuthentication } from 'renderer/apis/requests/folder/authentication/getFolderEffectiveAuthentication';
import { useGetAgentEffectiveAuthentication } from 'renderer/apis/requests/agent/authentication/getAgentEffectiveAuthentication';

const useEffectiveAuthentication = (options: {
  applicationId?: string;
  agentId?: string;
  folderId?: string;
}): Partial<EffectiveAuthentication> => {
  const [effectiveAuthentication, setEffectiveAuthentication] = useState<Partial<EffectiveAuthentication>>({});

  const applicationAuthenticationState = useGetApplicationEffectiveAuthentication({ cacheTime: 0 });
  const agentAuthenticationState = useGetAgentEffectiveAuthentication({ cacheTime: 0 });
  const folderAuthenticationState = useGetFolderEffectiveAuthentication({ cacheTime: 0 });

  useEffect(() => {
    if (options.applicationId) {
      (async () => {
        try {
          const result = await applicationAuthenticationState.mutateAsync({ applicationId: options.applicationId! });
          setEffectiveAuthentication(result);
        } catch (e) {}
      })();
    } else if (options.agentId) {
      (async () => {
        try {
          const result = await agentAuthenticationState.mutateAsync({ agentId: options.agentId! });
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
