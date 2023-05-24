import { useCallback, useEffect } from 'react';
import { isEmpty } from 'lodash';
import { InstanceMetricRO } from '../../../../common/generated_definitions';
import { useStomp } from '../../../apis/websockets/StompContext';
import { useGetLatestMetric } from '../../../apis/requests/metrics/getLatestMetric';
import { notEmpty } from '../../../utils/objectUtils';

const useWidgetSubscribeToMetrics = (
  itemId: string,
  metricNames: string[],
  options: {
    active?: boolean;
    callback?: (metricDto: InstanceMetricRO) => void;
    errorCallback?: (metricName: string) => void;
  } = {}
): void => {
  const { active = true } = options;
  const { subscribe } = useStomp();

  const metricUpdateHandler = useCallback(
    (metricDto: InstanceMetricRO): void => {
      options?.callback?.(metricDto);
    },
    [options]
  );

  const metricErrorHandler = useCallback(
    (metricName: string): void => {
      options?.errorCallback?.(metricName);
    },
    [options]
  );

  const latestMetricState = useGetLatestMetric({ disableGlobalError: true });

  useEffect(() => {
    if (active && itemId && !isEmpty(metricNames)) {
      (async () => {
        try {
          const results = await Promise.all(
            metricNames.map(async (metricName): Promise<InstanceMetricRO | undefined> => {
              try {
                return await latestMetricState.mutateAsync({ instanceId: itemId, metricName });
              } catch (e) {
                metricErrorHandler(metricName);
                return undefined;
              }
            })
          );
          results.filter(notEmpty).forEach(metricUpdateHandler);
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
                subscribe(
                  '/topic/metric/:instanceId/:metricName',
                  { instanceId: itemId, metricName },
                  metricUpdateHandler
                )
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
