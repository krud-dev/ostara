import { useEffect } from 'react';
import { useGetLatestMetric } from 'renderer/apis/metrics/getLatestMetric';
import { InstanceMetricRO } from '../../../../common/generated_definitions';

const useWidgetLatestMetrics = (
  itemId: string,
  metricNames: string[],
  callback: (metricDtos: InstanceMetricRO[]) => void
): void => {
  const getLatestMetricState = useGetLatestMetric();

  useEffect(() => {
    (async () => {
      try {
        const results = await Promise.all(
          metricNames.map(
            async (metricName): Promise<InstanceMetricRO> =>
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
