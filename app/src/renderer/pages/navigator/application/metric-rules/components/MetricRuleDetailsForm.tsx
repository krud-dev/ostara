import { FormattedMessage, useIntl } from 'react-intl';
import React, { FunctionComponent, useCallback, useMemo } from 'react';
import { Controller, FormProvider, useForm, useWatch } from 'react-hook-form';
import { Alert, Box, Button, DialogActions, DialogContent, Divider, MenuItem, TextField } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import {
  ApplicationMetricRule$Type,
  ApplicationMetricRuleOperation,
} from '../../../../../../common/generated_definitions';
import { toString } from 'lodash';
import { FLOAT_REGEX } from '../../../../../constants/regex';
import MetricSelectionForm from './MetricSelectionForm';
import { useUpdateEffect } from 'react-use';

export type MetricRuleDetailsFormProps = {
  applicationId: string;
  defaultValues: MetricRuleFormValues;
  disableMetrics?: boolean;
  onSubmit: (data: MetricRuleFormValues) => Promise<void>;
  onCancel: () => void;
};

export type MetricRuleFormValues = {
  name: string;
  type: ApplicationMetricRule$Type;
  metricName: string;
  metricStatistic: string;
  metricTags: string[];
  divisorMetricName: string;
  divisorMetricStatistic: string;
  divisorMetricTags: string[];
  operation: ApplicationMetricRuleOperation;
  value1: string;
  value2: string;
  enabled: boolean;
};

const MetricRuleDetailsForm: FunctionComponent<MetricRuleDetailsFormProps> = ({
  applicationId,
  defaultValues,
  disableMetrics = false,
  onSubmit,
  onCancel,
}: MetricRuleDetailsFormProps) => {
  const intl = useIntl();

  const methods = useForm<MetricRuleFormValues>({ defaultValues });
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
    setValue,
  } = methods;

  const type = useWatch<MetricRuleFormValues>({
    control: control,
    name: 'type',
    defaultValue: defaultValues.type,
  }) as ApplicationMetricRule$Type;
  const operation = useWatch<MetricRuleFormValues>({
    control: control,
    name: 'operation',
    defaultValue: defaultValues.operation,
  }) as ApplicationMetricRuleOperation;

  const submitHandler = handleSubmit(async (data): Promise<void> => {
    await onSubmit?.(data);
  });

  const cancelHandler = useCallback((): void => {
    onCancel();
  }, [onCancel]);

  const typeExplanationId = useMemo<string>(() => {
    switch (type) {
      case 'SIMPLE':
        return 'metricRuleExplanationSimple';
      case 'RELATIVE':
        return 'metricRuleExplanationRelative';
      default:
        return 'notAvailable';
    }
  }, [type]);

  useUpdateEffect(() => {
    if (type === 'SIMPLE') {
      setValue('divisorMetricName', '');
      setValue('divisorMetricStatistic', '');
      setValue('divisorMetricTags', []);
    }
  }, [type]);

  return (
    <FormProvider {...methods}>
      <Box component="form" onSubmit={submitHandler} noValidate>
        <DialogContent>
          <Controller
            name="name"
            rules={{
              required: intl.formatMessage({ id: 'requiredField' }),
            }}
            control={control}
            render={({ field: { ref, ...field }, fieldState: { invalid, error } }) => {
              return (
                <TextField
                  {...field}
                  inputRef={ref}
                  margin="normal"
                  required
                  fullWidth
                  label={<FormattedMessage id="name" />}
                  type="text"
                  autoComplete="off"
                  autoFocus
                  error={invalid}
                  helperText={error?.message}
                />
              );
            }}
          />

          <Controller
            name="type"
            control={control}
            render={({ field: { ref, ...field }, fieldState: { invalid, error } }) => {
              return (
                <TextField
                  {...field}
                  inputRef={ref}
                  margin="normal"
                  required
                  fullWidth
                  label={<FormattedMessage id="type" />}
                  select
                  error={invalid}
                  helperText={error?.message}
                  disabled={disableMetrics}
                >
                  <MenuItem value={'SIMPLE'}>
                    <FormattedMessage id="simple" />
                  </MenuItem>
                  <MenuItem value={'RELATIVE'}>
                    <FormattedMessage id="relative" />
                  </MenuItem>
                </TextField>
              );
            }}
          />

          <Alert severity={'info'} variant={'outlined'} sx={{ mt: 1 }}>
            <FormattedMessage id={typeExplanationId} />
          </Alert>

          <Divider sx={{ mt: 2, mb: 1 }} />

          <MetricSelectionForm namePrefix={'metric'} applicationId={applicationId} disabled={disableMetrics} />

          {type === 'RELATIVE' && (
            <MetricSelectionForm namePrefix={'divisorMetric'} applicationId={applicationId} disabled={disableMetrics} />
          )}

          <Divider sx={{ mt: 2, mb: 1 }} />

          <Controller
            name="operation"
            control={control}
            render={({ field: { ref, ...field }, fieldState: { invalid, error } }) => {
              return (
                <TextField
                  {...field}
                  inputRef={ref}
                  margin="normal"
                  required
                  fullWidth
                  label={<FormattedMessage id="operation" />}
                  select
                  error={invalid}
                  helperText={error?.message}
                >
                  <MenuItem value={'GREATER_THAN'}>
                    <FormattedMessage id="greaterThan" />
                  </MenuItem>
                  <MenuItem value={'LOWER_THAN'}>
                    <FormattedMessage id="lowerThan" />
                  </MenuItem>
                  <MenuItem value={'BETWEEN'}>
                    <FormattedMessage id="between" />
                  </MenuItem>
                </TextField>
              );
            }}
          />

          <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2 }}>
            <Controller
              name="value1"
              rules={{
                required: intl.formatMessage({ id: 'requiredField' }),
                validate: (value) => FLOAT_REGEX.test(toString(value)) || intl.formatMessage({ id: 'invalidNumber' }),
              }}
              control={control}
              render={({ field: { ref, ...field }, fieldState: { invalid, error } }) => {
                return (
                  <TextField
                    {...field}
                    inputRef={ref}
                    margin="normal"
                    required
                    fullWidth
                    label={<FormattedMessage id="value" />}
                    type="number"
                    autoComplete="off"
                    error={invalid}
                    helperText={error?.message}
                  />
                );
              }}
            />

            {operation === 'BETWEEN' && (
              <Controller
                name="value2"
                rules={{
                  required: intl.formatMessage({ id: 'requiredField' }),
                  validate: (value) => FLOAT_REGEX.test(value) || intl.formatMessage({ id: 'invalidNumber' }),
                }}
                control={control}
                render={({ field: { ref, ...field }, fieldState: { invalid, error } }) => {
                  return (
                    <TextField
                      {...field}
                      inputRef={ref}
                      margin="normal"
                      required
                      fullWidth
                      label={<FormattedMessage id="value2" />}
                      type="number"
                      autoComplete="off"
                      error={invalid}
                      helperText={error?.message}
                    />
                  );
                }}
              />
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Box sx={{ flexGrow: 1 }} />
          <Button variant="outlined" color="primary" disabled={isSubmitting} onClick={cancelHandler}>
            <FormattedMessage id={'cancel'} />
          </Button>
          <LoadingButton variant="contained" color="primary" loading={isSubmitting} type={'submit'}>
            <FormattedMessage id={'save'} />
          </LoadingButton>
        </DialogActions>
      </Box>
    </FormProvider>
  );
};

export default MetricRuleDetailsForm;
