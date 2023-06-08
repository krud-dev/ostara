import { FormattedMessage } from 'react-intl';
import React, { FunctionComponent, useCallback, useMemo } from 'react';
import { useAnalytics } from 'renderer/contexts/AnalyticsContext';
import { ApplicationMetricRuleCreateRequestRO, ApplicationMetricRuleRO } from 'common/generated_definitions';
import { useGetApplicationMetricsQuery } from 'renderer/apis/requests/application/metrics/getApplicationMetrics';
import { isEmpty } from 'lodash';
import { useCreateApplicationMetricRule } from 'renderer/apis/requests/application/metric-rules/createApplicationMetricRule';
import { IconViewer } from 'renderer/components/common/IconViewer';
import { LoadingButton } from '@mui/lab';
import { Tooltip } from '@mui/material';

export type PredefinedMetricRulesButtonProps = {
  applicationId: string;
  metricName?: string;
};

const PredefinedMetricRulesButton: FunctionComponent<PredefinedMetricRulesButtonProps> = ({
  applicationId,
  metricName,
}) => {
  const { track } = useAnalytics();

  const allRules = useMemo<ApplicationMetricRuleCreateRequestRO[]>(
    () => [
      {
        name: 'Low Free Disk Space',
        type: 'RELATIVE',
        metricName: {
          name: 'disk.free',
          statistic: 'VALUE',
          tags: {},
        },
        divisorMetricName: {
          name: 'disk.total',
          statistic: 'VALUE',
          tags: {},
        },
        operation: 'LOWER_THAN',
        value1: 0.2,
        enabled: true,
        applicationId: applicationId,
      },
      {
        name: 'High Active Connections',
        type: 'RELATIVE',
        metricName: {
          name: 'hikaricp.connections.active',
          statistic: 'VALUE',
          tags: {},
        },
        divisorMetricName: {
          name: 'hikaricp.connections.max',
          statistic: 'VALUE',
          tags: {},
        },
        operation: 'GREATER_THAN',
        value1: 0.9,
        enabled: true,
        applicationId: applicationId,
      },
      {
        name: 'High Committed Memory',
        type: 'RELATIVE',
        metricName: {
          name: 'jvm.memory.committed',
          statistic: 'VALUE',
          tags: {},
        },
        divisorMetricName: {
          name: 'jvm.memory.max',
          statistic: 'VALUE',
          tags: {},
        },
        operation: 'GREATER_THAN',
        value1: 0.8,
        enabled: true,
        applicationId: applicationId,
      },
      {
        name: 'High CPU Usage',
        type: 'SIMPLE',
        metricName: {
          name: 'system.cpu.usage',
          statistic: 'VALUE',
          tags: {},
        },
        operation: 'GREATER_THAN',
        value1: 0.85,
        enabled: true,
        applicationId: applicationId,
      },
      {
        name: 'High Active Sessions',
        type: 'RELATIVE',
        metricName: {
          name: 'tomcat.sessions.active.current',
          statistic: 'VALUE',
          tags: {},
        },
        divisorMetricName: {
          name: 'tomcat.sessions.active.max',
          statistic: 'VALUE',
          tags: {},
        },
        operation: 'GREATER_THAN',
        value1: 0.8,
        enabled: true,
        applicationId: applicationId,
      },
      {
        name: 'Low HTTP Requests Success Rate',
        type: 'RELATIVE',
        metricName: {
          name: 'http.server.requests',
          statistic: 'COUNT',
          tags: { outcome: 'SUCCESS' } as { [index: string]: string },
        },
        divisorMetricName: {
          name: 'http.server.requests',
          statistic: 'COUNT',
          tags: {},
        },
        operation: 'LOWER_THAN',
        value1: 0.8,
        enabled: true,
        applicationId: applicationId,
      },
      // {
      //   name: 'High HTTP Requests Max Time',
      //   type: 'SIMPLE',
      //   metricName: {
      //     name: 'http.server.requests',
      //     statistic: 'MAX',
      //     tags: {},
      //   },
      //   operation: 'GREATER_THAN',
      //   value1: 10,
      //   enabled: true,
      //   applicationId: applicationId,
      // },
      // {
      //   name: 'High Live Threads',
      //   type: 'SIMPLE',
      //   metricName: {
      //     name: 'jvm.threads.live',
      //     statistic: 'VALUE',
      //     tags: {},
      //   },
      //   operation: 'GREATER_THAN',
      //   value1: 500,
      //   enabled: true,
      //   applicationId: applicationId,
      // },
      // {
      //   name: 'High Executor Queue Size',
      //   type: 'SIMPLE',
      //   metricName: {
      //     name: 'executor.queued',
      //     statistic: 'VALUE',
      //     tags: {},
      //   },
      //   operation: 'GREATER_THAN',
      //   value1: 10000,
      //   enabled: true,
      //   applicationId: applicationId,
      // },
    ],
    [applicationId]
  );

  const getMetricsState = useGetApplicationMetricsQuery({ applicationId });

  const relevantRules = useMemo<ApplicationMetricRuleCreateRequestRO[] | undefined>(() => {
    if (!getMetricsState.data) {
      return undefined;
    }

    const applicationMetricNames = getMetricsState.data.map((metric) => metric.name);

    return allRules.filter((rule) => {
      if (!applicationMetricNames.find((mn) => mn === rule.metricName.name || mn === rule.divisorMetricName?.name)) {
        return false;
      }

      if (metricName && rule.metricName.name !== metricName && rule.divisorMetricName?.name !== metricName) {
        return false;
      }

      return true;
    });
  }, [allRules, getMetricsState.data, metricName]);

  const createState = useCreateApplicationMetricRule();

  const createHandler = useCallback(async (): Promise<void> => {
    if (!relevantRules || isEmpty(relevantRules)) {
      return;
    }

    track({ name: 'add_metric_rule_suggestions' });

    try {
      await Promise.all(
        relevantRules.map(
          async (rule): Promise<ApplicationMetricRuleRO> =>
            await createState.mutateAsync({
              metricRule: rule,
            })
        )
      );
    } catch (e) {}
  }, [track, relevantRules, createState]);

  const uiStatus = useMemo<'success' | 'loading' | 'empty'>(() => {
    if (!relevantRules || createState.isLoading) {
      return 'loading';
    }
    if (isEmpty(relevantRules)) {
      return 'empty';
    }
    return 'success';
  }, [relevantRules, createState.isLoading]);

  return (
    <Tooltip title={uiStatus === 'empty' ? <FormattedMessage id={'noRelevantPredefinedNotificationsFound'} /> : ''}>
      <span>
        <LoadingButton
          variant={'outlined'}
          color={'info'}
          startIcon={<IconViewer icon={'CircleNotificationsOutlined'} />}
          loading={uiStatus === 'loading'}
          disabled={uiStatus !== 'success'}
          onClick={createHandler}
        >
          <FormattedMessage id={'addPredefinedNotifications'} />
        </LoadingButton>
      </span>
    </Tooltip>
  );
};

export default PredefinedMetricRulesButton;
