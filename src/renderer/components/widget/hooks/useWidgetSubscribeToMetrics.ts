import { useEffect } from 'react';
import { useSubscribeToMetric } from 'renderer/apis/metrics/subscribeToMetric';
import { ApplicationMetricDTO } from 'infra/metrics/metricsService';
import { isEmpty } from 'lodash';

const useWidgetSubscribeToMetrics = (
  itemId: string,
  metricNames: string[],
  callback: (metricDto: ApplicationMetricDTO) => void,
  options: { active?: boolean } = {}
): void => {
  const { active = true } = options;

  const subscribeToMetricState = useSubscribeToMetric();

  useEffect(() => {
    let unsubscribes: (() => void)[];
    if (active && itemId && !isEmpty(metricNames)) {
      (async () => {
        try {
          unsubscribes = await Promise.all(
            metricNames.map(
              async (metric): Promise<() => void> =>
                await subscribeToMetricState.mutateAsync({
                  instanceId: itemId,
                  metricName: metric,
                  listener: (event, result) => {
                    callback(result);
                  },
                })
            )
          );
        } catch (e) {}
      })();
    }
    return () => {
      unsubscribes?.forEach((unsubscribe) => unsubscribe());
    };
  }, [itemId, metricNames, active]);
};
export default useWidgetSubscribeToMetrics;
