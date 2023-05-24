import React, { ReactNode, useCallback, useMemo, useState } from 'react';
import { isEmpty } from 'lodash';
import { FormattedMessage } from 'react-intl';

type WidgetErrorMetricsResult = {
  error: ReactNode | undefined;
  onMetricError: (metricName: string) => void;
};

const useWidgetErrorMetrics = (loading: boolean): WidgetErrorMetricsResult => {
  const [errorMetricNames, setErrorMetricNames] = useState<string[]>([]);

  const error = useMemo<ReactNode | undefined>(() => {
    return loading && !isEmpty(errorMetricNames) ? (
      <>
        <FormattedMessage id={'metricsNotAvailableInstance'} />
        <br />
        {errorMetricNames.join(', ')}
      </>
    ) : undefined;
  }, [loading, errorMetricNames]);

  const onMetricError = useCallback(
    (metricName: string): void => {
      setErrorMetricNames((prev) => (prev.includes(metricName) ? prev : [...prev, metricName]));
    },
    [setErrorMetricNames]
  );

  return useMemo<WidgetErrorMetricsResult>(() => ({ error, onMetricError }), [error, onMetricError]);
};
export default useWidgetErrorMetrics;
