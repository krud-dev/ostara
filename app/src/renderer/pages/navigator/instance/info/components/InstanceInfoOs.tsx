import React, { useMemo } from 'react';
import { FormattedMessage } from 'react-intl';
import { InfoActuatorResponse$Os } from 'common/generated_definitions';
import InstanceInfoValuesCard, {
  InstanceInfoCardValue,
} from 'renderer/pages/navigator/instance/info/components/InstanceInfoValuesCard';

type InstanceInfoOsProps = {
  os: InfoActuatorResponse$Os;
};

export default function InstanceInfoOs({ os }: InstanceInfoOsProps) {
  const values = useMemo<InstanceInfoCardValue[]>(
    () => [
      {
        id: 'version',
        label: <FormattedMessage id={'version'} />,
        value: os.name,
      },
    ],
    [os]
  );

  return <InstanceInfoValuesCard title={<FormattedMessage id={'os'} />} values={values} />;
}
