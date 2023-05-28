import { FormattedMessage } from 'react-intl';
import React, { FunctionComponent, useCallback, useMemo, useState } from 'react';
import { Dialog } from '@mui/material';
import NiceModal, { NiceModalHocProps, useModal } from '@ebay/nice-modal-react';
import DialogTitleEnhanced from 'renderer/components/dialog/DialogTitleEnhanced';
import { useUpdateApplicationMetricRule } from '../../../../../apis/requests/application/metric-rules/updateApplicationMetricRule';
import MetricRuleDetailsForm, { MetricRuleFormValues } from './MetricRuleDetailsForm';
import { ApplicationMetricRuleRO } from '../../../../../../common/generated_definitions';
import { map } from 'lodash';

export type UpdateMetricRuleDialogProps = {
  metricRule: ApplicationMetricRuleRO;
  onUpdated?: (metricRule: ApplicationMetricRuleRO) => void;
};

const UpdateMetricRuleDialog: FunctionComponent<UpdateMetricRuleDialogProps & NiceModalHocProps> = NiceModal.create(
  ({ metricRule, onUpdated }) => {
    const modal = useModal();

    const [submitting, setSubmitting] = useState<boolean>(false);

    const updateState = useUpdateApplicationMetricRule();

    const submitHandler = useCallback(
      async (data: MetricRuleFormValues): Promise<void> => {
        setSubmitting(true);

        try {
          const result = await updateState.mutateAsync({
            id: metricRule.id,
            applicationId: metricRule.applicationId,
            metricRule: {
              ...metricRule,
              name: data.name,
              operation: data.operation,
              enabled: data.enabled,
              value1: parseFloat(data.value1),
              value2: parseFloat(data.value2),
            },
          });
          if (result) {
            onUpdated?.(result);

            modal.resolve(result);
            await modal.hide();
          }
        } catch (e) {
        } finally {
          setSubmitting(false);
        }
      },
      [setSubmitting, metricRule, onUpdated, modal, updateState]
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
        name: metricRule.name,
        metricName: metricRule.metricName.name,
        metricStatistic: metricRule.metricName.statistic,
        metricTags: map(metricRule.metricName.tags, (value, key) => `${key}=${value}`),
        operation: metricRule.operation || 'GREATER_THAN',
        enabled: metricRule.enabled,
        value1: metricRule.value1.toString(),
        value2: metricRule.value2?.toString() || '',
      }),
      [metricRule]
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
          <FormattedMessage id={'updateMetricNotification'} />
        </DialogTitleEnhanced>
        <MetricRuleDetailsForm
          applicationId={metricRule.applicationId}
          defaultValues={defaultValues}
          disableMetrics
          onSubmit={submitHandler}
          onCancel={cancelHandler}
        />
      </Dialog>
    );
  }
);

export default UpdateMetricRuleDialog;
