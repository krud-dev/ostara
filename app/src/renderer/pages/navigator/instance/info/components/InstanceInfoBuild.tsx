import React, { useMemo } from 'react';
import { FormattedMessage } from 'react-intl';
import { InfoActuatorResponse$Build } from 'common/generated_definitions';
import FormattedDateAndRelativeTime from 'renderer/components/format/FormattedDateAndRelativeTime';
import InstanceInfoValuesCard, {
  InstanceInfoCardValue,
} from 'renderer/pages/navigator/instance/info/components/InstanceInfoValuesCard';

type InstanceInfoBuildProps = {
  build: InfoActuatorResponse$Build;
};

export default function InstanceInfoBuild({ build }: InstanceInfoBuildProps) {
  const values = useMemo<InstanceInfoCardValue[]>(
    () => [
      {
        id: 'version',
        label: <FormattedMessage id={'version'} />,
        value: build.version || <FormattedMessage id={'notAvailable'} />,
      },
      {
        id: 'time',
        label: <FormattedMessage id={'time'} />,
        value: build.time?.date ? <FormattedDateAndRelativeTime value={build.time.date} /> : '',
        hide: !build.time?.date,
      },
      {
        id: 'group',
        label: <FormattedMessage id={'group'} />,
        value: build.group,
        advanced: true,
        hide: !build.group,
      },
      {
        id: 'artifact',
        label: <FormattedMessage id={'artifact'} />,
        value: build.artifact,
        advanced: true,
        hide: !build.artifact,
      },
      {
        id: 'name',
        label: <FormattedMessage id={'name'} />,
        value: build.name,
        advanced: true,
        hide: !build.name,
      },
    ],
    [build]
  );

  return <InstanceInfoValuesCard title={<FormattedMessage id={'build'} />} values={values} />;
}
