import { useEffect } from 'react';
import { isEmpty } from 'lodash';
import { InstanceMetricRO } from '../../../../common/generated_definitions';
import { useStomp } from '../../../apis/websockets/StompContext';
import { useGetLatestMetric } from '../../../apis/requests/metrics/getLatestMetric';
import { notEmpty } from '../../../utils/objectUtils';

const useWidgetSubscribeToMetrics = (
  itemId: string,
  metricNames: string[],
  callback: (metricDto: InstanceMetricRO) => void,
  options: { active?: boolean } = {}
): void => {
  const { active = true } = options;
  const { subscribe } = useStomp();

  const latestMetricState = useGetLatestMetric();

  useEffect(() => {
    if (active && itemId && !isEmpty(metricNames)) {
      (async () => {
        try {
          const results = await Promise.all(
            metricNames.map(async (metricName): Promise<InstanceMetricRO | undefined> => {
              try {
                return await latestMetricState.mutateAsync({ instanceId: itemId, metricName });
              } catch (e) {
                return undefined;
              }
            })
          );
          results.filter(notEmpty).forEach(callback);
        } catch (e) {}
      })();
    }
  }, [itemId, metricNames, active]);

  useEffect(() => {
    let unsubscribes: (() => void)[];
    if (active && itemId && !isEmpty(metricNames)) {
      (async () => {
        try {
          unsubscribes = await Promise.all(
            metricNames.map(
              async (metricName): Promise<() => void> =>
                subscribe('/topic/metric/:instanceId/:metricName', { instanceId: itemId, metricName }, callback)
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
