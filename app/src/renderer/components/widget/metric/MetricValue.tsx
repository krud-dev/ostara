import * as React from 'react';
import { ReactNode, useMemo } from 'react';
import CountdownValue from 'renderer/components/widget/metric/CountdownValue';
import { formatWidgetValue } from 'renderer/utils/formatUtils';
import { useIntl } from 'react-intl';
import { WidgetValueType } from '../widget';

export type MetricValueProps = {
  value: number;
  valueType: WidgetValueType;
};

const MetricValue = ({ value, valueType }: MetricValueProps) => {
  const intl = useIntl();

  const displayValue = useMemo<ReactNode>(() => {
    switch (valueType) {
      case 'seconds':
        return <CountdownValue seconds={value} />;
      default:
        return formatWidgetValue(value, valueType, intl);
    }
  }, [value, valueType]);

  return <>{displayValue}</>;
};

export default MetricValue;
