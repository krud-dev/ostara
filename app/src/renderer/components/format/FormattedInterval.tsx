import { useMemo } from 'react';
import { useIntl } from 'react-intl';
import { isNumber } from 'lodash';
import { formatInterval } from '../../utils/formatUtils';

type FormattedIntervalProps = {
  value: number;
  isSeconds?: boolean;
};

export default function FormattedInterval({ value, isSeconds }: FormattedIntervalProps) {
  const intl = useIntl();

  const interval = useMemo<string>(() => formatInterval(isSeconds ? value * 1000 : value, intl), [value, isSeconds]);

  return <>{interval}</>;
}
