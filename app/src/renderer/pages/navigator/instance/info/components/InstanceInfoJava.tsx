import React, { useMemo } from 'react';
import { FormattedMessage } from 'react-intl';
import { InfoActuatorResponse$Java } from 'common/generated_definitions';
import InstanceInfoValuesCard, {
  InstanceInfoCardValue,
} from 'renderer/pages/navigator/instance/info/components/InstanceInfoValuesCard';

type InstanceInfoJavaProps = {
  java: InfoActuatorResponse$Java;
};

export default function InstanceInfoJava({ java }: InstanceInfoJavaProps) {
  const values = useMemo<InstanceInfoCardValue[]>(
    () => [
      {
        id: 'version',
        label: <FormattedMessage id={'version'} />,
        value: java.version || <FormattedMessage id={'notAvailable'} />,
      },
      {
        id: 'vendorVersion',
        label: <FormattedMessage id={'vendorVersion'} />,
        value: java.vendor?.version,
        hide: !java.vendor?.version,
      },
      {
        id: 'vendorName',
        label: <FormattedMessage id={'vendorName'} />,
        value: java.vendor?.name,
        advanced: true,
        hide: !java.vendor?.name,
      },
      {
        id: 'runtimeVersion',
        label: <FormattedMessage id={'runtimeVersion'} />,
        value: java.runtime?.version,
        advanced: true,
        hide: !java.runtime?.version,
      },
      {
        id: 'runtimeName',
        label: <FormattedMessage id={'runtimeName'} />,
        value: java.runtime?.name,
        advanced: true,
        hide: !java.runtime?.name,
      },
      {
        id: 'jvmVersion',
        label: <FormattedMessage id={'jvmVersion'} />,
        value: java.jvm?.version,
        advanced: true,
        hide: !java.jvm?.version,
      },
      {
        id: 'jvmName',
        label: <FormattedMessage id={'jvmName'} />,
        value: java.jvm?.name,
        advanced: true,
        hide: !java.jvm?.name,
      },
      {
        id: 'jvmVendor',
        label: <FormattedMessage id={'jvmVendor'} />,
        value: java.jvm?.vendor,
        advanced: true,
        hide: !java.jvm?.vendor,
      },
    ],
    [java]
  );

  return <InstanceInfoValuesCard title={<FormattedMessage id={'java'} />} values={values} />;
}
