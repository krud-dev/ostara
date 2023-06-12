import React, { useMemo } from 'react';
import { FormattedMessage } from 'react-intl';
import InstanceInfoValuesCard, {
  InstanceInfoCardValue,
} from 'renderer/pages/navigator/instance/info/components/InstanceInfoValuesCard';
import { map } from 'lodash';

type InstanceInfoExtraValuesProps = {
  extraValues: { [key: string]: string };
};

export default function InstanceInfoExtraValues({ extraValues }: InstanceInfoExtraValuesProps) {
  const values = useMemo<InstanceInfoCardValue[]>(
    () =>
      map(extraValues, (value, key) => ({
        id: key,
        label: key,
        value: value,
      })),
    [extraValues]
  );

  return <InstanceInfoValuesCard title={<FormattedMessage id={'other'} />} values={values} />;
}
