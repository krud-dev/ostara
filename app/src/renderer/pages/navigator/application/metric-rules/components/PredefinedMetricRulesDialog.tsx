import { FormattedMessage } from 'react-intl';
import React, { FunctionComponent, useCallback, useMemo, useState } from 'react';
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  FormControlLabel,
  Stack,
  Typography,
} from '@mui/material';
import NiceModal, { NiceModalHocProps, useModal } from '@ebay/nice-modal-react';
import DialogTitleEnhanced from '../../../../../components/dialog/DialogTitleEnhanced';
import { useAnalytics } from '../../../../../contexts/AnalyticsContext';
import {
  ApplicationMetricRuleCreateRequestRO,
  ApplicationMetricRuleRO,
} from '../../../../../../common/generated_definitions';
import { useGetApplicationMetricsQuery } from '../../../../../apis/requests/application/metrics/getApplicationMetrics';
import { isEmpty } from 'lodash';
import { useCreateApplicationMetricRule } from '../../../../../apis/requests/application/metric-rules/createApplicationMetricRule';
import LogoLoaderCenter from '../../../../../components/common/LogoLoaderCenter';
import EmptyContent from '../../../../../components/help/EmptyContent';
import { getMetricRuleFormValues, getMetricRuleFormValuesFormula } from '../../../../../utils/metricUtils';
import { useSnackbar } from 'notistack';

export type PredefinedMetricRulesDialogProps = {
  applicationId: string;
  metricName?: string;
};

const PredefinedMetricRulesDialog: FunctionComponent<PredefinedMetricRulesDialogProps & NiceModalHocProps> =
  NiceModal.create(({ applicationId, metricName }) => {
    const modal = useModal();
    const { enqueueSnackbar } = useSnackbar();
    const { track } = useAnalytics();

    const [selectedRules, setSelectedRules] = useState<ApplicationMetricRuleCreateRequestRO[]>([]);

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
          name: 'High HTTP Requests Max Time',
          type: 'SIMPLE',
          metricName: {
            name: 'http.server.requests',
            statistic: 'MAX',
            tags: {},
          },
          operation: 'GREATER_THAN',
          value1: 10,
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
        {
          name: 'High Live Threads',
          type: 'SIMPLE',
          metricName: {
            name: 'jvm.threads.live',
            statistic: 'VALUE',
            tags: {},
          },
          operation: 'GREATER_THAN',
          value1: 500,
          enabled: true,
          applicationId: applicationId,
        },
        {
          name: 'High Executor Queue Size',
          type: 'SIMPLE',
          metricName: {
            name: 'executor.queued',
            statistic: 'VALUE',
            tags: {},
          },
          operation: 'GREATER_THAN',
          value1: 10000,
          enabled: true,
          applicationId: applicationId,
        },
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

    const status = useMemo<'success' | 'loading' | 'empty'>(() => {
      if (!relevantRules) {
        return 'loading';
      }
      if (isEmpty(relevantRules)) {
        return 'empty';
      }
      return 'success';
    }, [relevantRules]);

    const createState = useCreateApplicationMetricRule();

    const submitHandler = useCallback(async (): Promise<void> => {
      if (isEmpty(selectedRules)) {
        enqueueSnackbar(<FormattedMessage id={'selectNotificationsToAdd'} />, { variant: 'error' });
        return;
      }

      track({ name: 'add_metric_rule_suggestions' });

      try {
        const results = await Promise.all(
          selectedRules.map(
            async (rule): Promise<ApplicationMetricRuleRO> =>
              await createState.mutateAsync({
                metricRule: rule,
              })
          )
        );

        modal.resolve(results);
        modal.hide();
      } catch (e) {}
    }, [track, selectedRules, createState, modal]);

    const cancelHandler = useCallback((): void => {
      modal.resolve(undefined);
      modal.hide();
    }, [modal]);

    const ruleCheckedHandler = useCallback(
      (rule: ApplicationMetricRuleCreateRequestRO): void => {
        setSelectedRules((prev) => {
          if (prev.includes(rule)) {
            return prev.filter((r) => r !== rule);
          }
          return [...prev, rule];
        });
      },
      [setSelectedRules]
    );

    return (
      <Dialog
        open={modal.visible}
        onClose={cancelHandler}
        TransitionProps={{
          onExited: () => modal.remove(),
        }}
        fullWidth
        maxWidth={'md'}
      >
        <DialogTitleEnhanced onClose={cancelHandler}>
          <FormattedMessage id={'addPredefinedNotifications'} />
        </DialogTitleEnhanced>
        <DialogContent>
          {status === 'loading' && <LogoLoaderCenter />}
          {status === 'empty' && (
            <EmptyContent
              text={<FormattedMessage id={'noData'} />}
              description={<FormattedMessage id={'noRelevantNotificationSuggestions'} />}
            />
          )}
          {status === 'success' && (
            <Stack direction={'column'} spacing={1}>
              {relevantRules?.map((rule) => (
                <Box key={rule.name}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={selectedRules.includes(rule)}
                        onChange={() => ruleCheckedHandler(rule)}
                        name={rule.name}
                      />
                    }
                    label={
                      <Box>
                        <Typography variant={'subtitle2'}>{rule.name}</Typography>
                        <Typography variant={'body2'} sx={{ color: 'text.secondary' }}>
                          <FormattedMessage id={'formula'} />
                          {': '}
                          {getMetricRuleFormValuesFormula(getMetricRuleFormValues(rule))}
                        </Typography>
                      </Box>
                    }
                  />
                </Box>
              ))}
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" color="inherit" onClick={cancelHandler}>
            <FormattedMessage id={'cancel'} />
          </Button>
          <Button variant="contained" color={'primary'} onClick={submitHandler}>
            <FormattedMessage id={'addSelectedNotifications'} />
          </Button>
        </DialogActions>
      </Dialog>
    );
  });

export default PredefinedMetricRulesDialog;
