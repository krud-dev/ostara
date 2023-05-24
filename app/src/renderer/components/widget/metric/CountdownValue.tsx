import * as React from 'react';
import { useMemo, useState } from 'react';
import { useIntl } from 'react-intl';
import { useHarmonicIntervalFn } from 'react-use';
import { formatWidgetValue } from 'renderer/utils/formatUtils';

export type CountdownValueProps = {
  seconds: number;
};

const CountdownValue = ({ seconds }: CountdownValueProps) => {
  const intl = useIntl();

  const [tickFlag, setTickFlag] = useState<boolean>(false);

  const inputTime = useMemo<number>(() => Date.now() - seconds * 1000, [seconds]);
  const countdownSeconds = useMemo<number>(() => (Date.now() - inputTime) / 1000, [inputTime, tickFlag]);
  const countdownValue = useMemo<string>(
    () => formatWidgetValue(countdownSeconds, 'seconds', intl),
    [countdownSeconds]
  );

  useHarmonicIntervalFn(() => {
    setTickFlag((flag) => !flag);
  }, 1000);

  return <>{countdownValue}</>;
};

export default CountdownValue;
