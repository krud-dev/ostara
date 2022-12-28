import * as React from 'react';
import { ReactNode, useMemo } from 'react';
import CountdownValue from 'renderer/components/widget/metric/CountdownValue';

export type MetricValueProps = {
  value: number;
  unit?: string | null;
};

const MetricValue = ({ value, unit }: MetricValueProps) => {
  const displayValue = useMemo<ReactNode>(() => {
    if (!unit) {
      return value.toString();
    }
    switch (unit) {
      case 'seconds':
        return <CountdownValue seconds={value} />;
      default:
        return value.toString();
    }
  }, [value, unit]);

  return <>{displayValue}</>;
};

export default MetricValue;
