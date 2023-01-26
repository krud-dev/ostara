import React, { FunctionComponent, useMemo } from 'react';
import { FormattedRelativeTime } from 'react-intl';
import { Props } from 'react-intl/src/components/relative';

interface FormattedRelativeTimeNowProps extends Props {
  value: number;
}

const FormattedRelativeTimeNow: FunctionComponent<FormattedRelativeTimeNowProps> = ({ value, ...rest }) => {
  const calculatedValue = useMemo<number>(() => {
    const now = new Date().getTime();
    return (value - now) / 1000;
  }, [value]);

  return <FormattedRelativeTime value={calculatedValue} numeric="auto" updateIntervalInSeconds={1} {...rest} />;
};
export default FormattedRelativeTimeNow;
