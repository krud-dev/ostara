import React, { ReactNode, useMemo } from 'react';
import { InfoActuatorResponse$Git } from 'common/generated_definitions';
import { InfoActuatorResponse$Git$Typed } from 'common/manual_definitions';
import InstanceInfoGitSimple from 'renderer/pages/navigator/instance/info/components/InstanceInfoGitSimple';
import InstanceInfoGitUnknown from 'renderer/pages/navigator/instance/info/components/InstanceInfoGitUnknown';
import InstanceInfoGitFull from 'renderer/pages/navigator/instance/info/components/InstanceInfoGitFull';

type InstanceInfoGitProps = {
  git: InfoActuatorResponse$Git;
};

export default function InstanceInfoGit({ git }: InstanceInfoGitProps) {
  const gitTyped = useMemo<InfoActuatorResponse$Git$Typed>(() => git as InfoActuatorResponse$Git$Typed, [git]);

  const typedComponent = useMemo<ReactNode>(() => {
    switch (gitTyped.type) {
      case 'simple':
        return <InstanceInfoGitSimple git={gitTyped} />;
      case 'full':
        return <InstanceInfoGitFull git={gitTyped} />;
      case 'unknown':
        return <InstanceInfoGitUnknown git={gitTyped} />;
      default:
        return null;
    }
  }, [gitTyped]);

  return <>{typedComponent}</>;
}
