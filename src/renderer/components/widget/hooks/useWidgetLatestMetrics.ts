import { useEffect } from 'react';
import { ApplicationMetricDTO } from 'infra/metrics/metricsService';
import { useGetLatestMetric } from 'renderer/apis/metrics/getLatestMetric';

const useWidgetLatestMetrics = (
  itemId: string,
  metricNames: string[],
  callback: (metricDtos: (ApplicationMetricDTO | undefined)[]) => void
): void => {
  const getLatestMetricState = useGetLatestMetric();

  useEffect(() => {
    (async () => {
      try {
        const results = await Promise.all(
          metricNames.map(
            async (metricName): Promise<ApplicationMetricDTO | undefined> =>
              await getLatestMetricState.mutateAsync({
                instanceId: itemId,
                metricName: metricName,
              })
          )
        );
        callback(results);
      } catch (e) {}
    })();
  }, [itemId, metricNames]);
};
export default useWidgetLatestMetrics;
