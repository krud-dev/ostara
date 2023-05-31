import React, { FunctionComponent, useMemo } from 'react';
import { FormattedRelativeTime } from 'react-intl';
import { Props } from 'react-intl/src/components/relative';
import { RelativeTimeFormatSingularUnit } from '@formatjs/ecma402-abstract';

interface FormattedRelativeTimeNowProps extends Props {
  value: number;
}

const FormattedRelativeTimeNow: FunctionComponent<FormattedRelativeTimeNowProps> = ({ value, ...rest }) => {
  const calculatedSeconds = useMemo<number>(() => {
    const now = new Date().getTime();
    return Math.round((value - now) / 1000);
  }, [value]);

  const calculatedValue = useMemo<number>(() => {
    const absCalculatedSeconds = Math.abs(calculatedSeconds);
    if (absCalculatedSeconds < 60) {
      return calculatedSeconds;
    }
    if (absCalculatedSeconds < 60 * 60) {
      return Math.round(calculatedSeconds / 60);
    }
    if (absCalculatedSeconds < 60 * 60 * 24) {
      return Math.round(calculatedSeconds / 60 / 60);
    }
    if (absCalculatedSeconds < 60 * 60 * 24 * 30) {
      return Math.round(calculatedSeconds / 60 / 60 / 24);
    }
    if (absCalculatedSeconds < 60 * 60 * 24 * 365) {
      return Math.round(calculatedSeconds / 60 / 60 / 24 / 30);
    }
    return Math.round(calculatedSeconds / 60 / 60 / 24 / 365);
  }, [calculatedSeconds]);

  const unit = useMemo<RelativeTimeFormatSingularUnit>(() => {
    const absCalculatedSeconds = Math.abs(calculatedSeconds);
    if (absCalculatedSeconds < 60) {
      return 'second';
    }
    if (absCalculatedSeconds < 60 * 60) {
      return 'minute';
    }
    if (absCalculatedSeconds < 60 * 60 * 24) {
      return 'hour';
    }
    if (absCalculatedSeconds < 60 * 60 * 24 * 30) {
      return 'day';
    }
    if (absCalculatedSeconds < 60 * 60 * 24 * 365) {
      return 'month';
    }
    return 'year';
  }, [calculatedSeconds]);

  const updateIntervalInSeconds = useMemo<number>(() => {
    switch (unit) {
      case 'second':
        return 1;
      case 'minute':
        return 10;
      case 'hour':
        return 60;
      default:
        return 0;
    }
  }, [unit]);

  return (
    <FormattedRelativeTime
      value={calculatedValue}
      numeric="auto"
      updateIntervalInSeconds={updateIntervalInSeconds}
      unit={unit}
      {...rest}
    />
  );
};
export default FormattedRelativeTimeNow;
