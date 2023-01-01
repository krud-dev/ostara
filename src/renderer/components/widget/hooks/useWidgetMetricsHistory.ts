import { useEffect } from 'react';
import { ApplicationMetricDTO } from 'infra/metrics/metricsService';
import { useGetMetricsHistory } from 'renderer/apis/metrics/getMetricsHistory';

const useWidgetMetricsHistory = (
  itemId: string,
  metricNames: string[],
  from: Date,
  to: Date,
  callback: (metricDtos: ApplicationMetricDTO[]) => void
): void => {
  const getMetricsHistoryState = useGetMetricsHistory();

  useEffect(() => {
    (async () => {
      try {
        const results = await Promise.all(
          metricNames.map(
            async (metricName): Promise<ApplicationMetricDTO> =>
              await getMetricsHistoryState.mutateAsync({
                instanceId: itemId,
                metricName: metricName,
                from: from,
                to: to,
              })
          )
        );
        callback(results);
      } catch (e) {}
    })();
  }, [itemId, metricNames]);
};
export default useWidgetMetricsHistory;
