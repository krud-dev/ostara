import { FormattedMessage } from 'react-intl';
import React, { FunctionComponent, useCallback, useMemo, useState } from 'react';
import { Dialog } from '@mui/material';
import NiceModal, { NiceModalHocProps, useModal } from '@ebay/nice-modal-react';
import DialogTitleEnhanced from 'renderer/components/dialog/DialogTitleEnhanced';
import { useAnalytics } from '../../../../../contexts/AnalyticsContext';
import {
  ApplicationMetricRuleCreateRequestRO,
  ApplicationMetricRuleRO,
} from '../../../../../../common/generated_definitions';
import MetricRuleDetailsForm, { MetricRuleFormValues } from './MetricRuleDetailsForm';
import { useCreateApplicationMetricRule } from '../../../../../apis/requests/application/metric-rules/createApplicationMetricRule';

export type CreateMetricRuleDialogProps = {
  applicationId: string;
  onCreated?: (metricRule: ApplicationMetricRuleRO) => void;
};

const CreateMetricRuleDialog: FunctionComponent<CreateMetricRuleDialogProps & NiceModalHocProps> = NiceModal.create(
  ({ applicationId, onCreated }) => {
    const modal = useModal();
    const { track } = useAnalytics();

    const [submitting, setSubmitting] = useState<boolean>(false);

    const createState = useCreateApplicationMetricRule();

    const submitHandler = useCallback(
      async (data: MetricRuleFormValues): Promise<void> => {
        setSubmitting(true);

        const metricRuleToCreate: ApplicationMetricRuleCreateRequestRO = {
          applicationId: applicationId,
          name: data.name,
          operation: data.operation,
          metricName: {
            name: data.metricName,
            statistic: data.metricStatistic,
            tags: data.metricTags.reduce((accumulator, currentValue) => {
              const [key, value] = currentValue.split('=');
              accumulator[key] = value;
              return accumulator;
            }, {} as { [key: string]: string }),
          },
          enabled: data.enabled,
          value1: parseFloat(data.value1),
          value2: parseFloat(data.value2),
        };
        try {
          const result = await createState.mutateAsync({ metricRule: metricRuleToCreate });
          if (result) {
            track({ name: 'add_metric_rule' });

            onCreated?.(result);

            modal.resolve(result);
            await modal.hide();
          }
        } catch (e) {
        } finally {
          setSubmitting(false);
        }
      },
      [applicationId, onCreated, createState, modal]
    );

    const cancelHandler = useCallback((): void => {
      if (submitting) {
        return;
      }
      modal.resolve(undefined);
      modal.hide();
    }, [submitting, modal]);

    const defaultValues = useMemo<MetricRuleFormValues>(
      () => ({
        name: '',
        metricName: '',
        metricStatistic: '',
        metricTags: [],
        operation: 'GREATER_THAN',
        enabled: true,
        value1: '',
        value2: '',
      }),
      []
    );

    return (
      <Dialog
        open={modal.visible}
        onClose={cancelHandler}
        TransitionProps={{
          onExited: () => modal.remove(),
        }}
        fullWidth
        maxWidth={'xs'}
      >
        <DialogTitleEnhanced disabled={submitting} onClose={cancelHandler}>
          <FormattedMessage id={'addMetricNotification'} />
        </DialogTitleEnhanced>
        <MetricRuleDetailsForm
          applicationId={applicationId}
          defaultValues={defaultValues}
          onSubmit={submitHandler}
          onCancel={cancelHandler}
        />
      </Dialog>
    );
  }
);

export default CreateMetricRuleDialog;
