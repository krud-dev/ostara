import * as React from 'react';
import { ReactNode, useMemo } from 'react';
import CountdownValue from 'renderer/components/widget/metric/CountdownValue';
import { isNil } from 'lodash';
import NumberValue from 'renderer/components/widget/metric/NumberValue';

export type MetricValueProps = {
  value: number;
  unit?: string | null;
};

const MetricValue = ({ value, unit }: MetricValueProps) => {
  const displayValue = useMemo<ReactNode>(() => {
    if (isNil(value)) {
      return '\u00A0';
    }
    if (unit === 'seconds') {
      return <CountdownValue seconds={value} />;
    }
    return <NumberValue value={value} />;
  }, [value, unit]);

  return <>{displayValue}</>;
};

export default MetricValue;
