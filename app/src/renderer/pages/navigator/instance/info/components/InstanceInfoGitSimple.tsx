import React, { useMemo } from 'react';
import { FormattedMessage } from 'react-intl';
import InstanceInfoValuesCard, {
  InstanceInfoCardValue,
} from 'renderer/pages/navigator/instance/info/components/InstanceInfoValuesCard';
import FormattedDateAndRelativeTime from 'renderer/components/format/FormattedDateAndRelativeTime';
import { InfoActuatorResponse$Git$Simple$Typed } from 'common/manual_definitions';

type InstanceInfoGitSimpleProps = {
  git: InfoActuatorResponse$Git$Simple$Typed;
};

export default function InstanceInfoGitSimple({ git }: InstanceInfoGitSimpleProps) {
  const values = useMemo<InstanceInfoCardValue[]>(
    () => [
      {
        id: 'branch',
        label: <FormattedMessage id={'branch'} />,
        value: git.branch || <FormattedMessage id={'notAvailable'} />,
      },
      {
        id: 'commit',
        label: <FormattedMessage id={'commit'} />,
        value: git.commit?.id || <FormattedMessage id={'notAvailable'} />,
      },
      {
        id: 'commitTime',
        label: <FormattedMessage id={'time'} />,
        value: git.commit?.time?.date ? <FormattedDateAndRelativeTime value={git.commit.time?.date} /> : '',
        advanced: true,
        hide: !git.commit?.time?.date,
      },
    ],
    [git]
  );

  return <InstanceInfoValuesCard title={<FormattedMessage id={'git'} />} values={values} />;
}
