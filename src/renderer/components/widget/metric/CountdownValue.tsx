import * as React from 'react';
import { useCallback, useMemo, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { useHarmonicIntervalFn } from 'react-use';

export type CountdownValueProps = {
  seconds: number;
};

const CountdownValue = ({ seconds }: CountdownValueProps) => {
  const [tickFlag, setTickFlag] = useState<boolean>(false);

  const inputTime = useMemo<number>(() => Date.now() - seconds * 1000, [seconds]);
  const countdownSeconds = useMemo<number>(() => (Date.now() - inputTime) / 1000, [inputTime, tickFlag]);

  const padValue = useCallback((value: number): string => (value < 10 ? `0${value}` : `${value}`), []);

  const d = useMemo<number>(() => Math.floor(countdownSeconds / 86400), [countdownSeconds]);
  const h = useMemo<string>(() => padValue(Math.floor((countdownSeconds % 86400) / 3600)), [countdownSeconds]);
  const m = useMemo<string>(() => padValue(Math.floor((countdownSeconds % 3600) / 60)), [countdownSeconds]);
  const s = useMemo<string>(() => padValue(Math.floor(countdownSeconds % 60)), [countdownSeconds]);

  useHarmonicIntervalFn(() => {
    setTickFlag((flag) => !flag);
  }, 1000);

  return (
    <>
      {d}
      <FormattedMessage id={'daysShort'} /> {h}
      <FormattedMessage id={'hoursShort'} /> {m}
      <FormattedMessage id={'minutesShort'} /> {s}
      <FormattedMessage id={'secondsShort'} />
    </>
  );
};

export default CountdownValue;
