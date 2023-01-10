import * as React from 'react';
import { useMemo } from 'react';

export type NumberValueProps = {
  value: number;
};

const NumberValue = ({ value }: NumberValueProps) => {
  const displayValue = useMemo<number>(() => Math.round((value + Number.EPSILON) * 100) / 100, [value]);
  return <>{displayValue}</>;
};

export default NumberValue;
