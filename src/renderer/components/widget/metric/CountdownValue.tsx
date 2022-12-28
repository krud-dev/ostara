import * as React from 'react';
import { useMemo } from 'react';
import { FormattedMessage } from 'react-intl';

export type CountdownValueProps = {
  seconds: number;
};

const CountdownValue = ({ seconds }: CountdownValueProps) => {
  const d = useMemo<number>(() => Math.floor(seconds / 86400), [seconds]);
  const h = useMemo<number>(() => Math.floor((seconds % 86400) / 3600), [seconds]);
  const m = useMemo<number>(() => Math.floor((seconds % 3600) / 60), [seconds]);
  const s = useMemo<number>(() => Math.floor(seconds % 60), [seconds]);

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
