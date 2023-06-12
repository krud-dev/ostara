import React, { useMemo } from 'react';
import { FormattedMessage } from 'react-intl';
import { InfoActuatorResponse$Git$Unknown$Typed } from 'common/manual_definitions';
import InstanceInfoJsonCard from 'renderer/pages/navigator/instance/info/components/InstanceInfoJsonCard';

type InstanceInfoGitUnknownProps = {
  git: InfoActuatorResponse$Git$Unknown$Typed;
};

export default function InstanceInfoGitUnknown({ git }: InstanceInfoGitUnknownProps) {
  const object = useMemo<any>(() => {
    const copy: any = { ...git };
    delete copy.type;
    return copy;
  }, [git]);

  return <InstanceInfoJsonCard title={<FormattedMessage id={'git'} />} object={object} />;
}
