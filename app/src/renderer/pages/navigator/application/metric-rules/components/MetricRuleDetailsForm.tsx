import { FormattedMessage, useIntl } from 'react-intl';
import React, { FunctionComponent, useCallback, useEffect } from 'react';
import { Controller, FormProvider, useForm, useWatch } from 'react-hook-form';
import {
  Box,
  Button,
  CircularProgress,
  DialogActions,
  DialogContent,
  Divider,
  ListSubheader,
  MenuItem,
  TextField,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import InputAdornment from '@mui/material/InputAdornment';
import { ApplicationMetricRuleOperation } from '../../../../../../common/generated_definitions';
import { toString } from 'lodash';
import { useGetApplicationMetricsQuery } from '../../../../../apis/requests/application/metrics/getApplicationMetrics';
import { FLOAT_REGEX } from '../../../../../constants/regex';
import { useGetApplicationMetricDetailsQuery } from '../../../../../apis/requests/application/metrics/getApplicationMetricDetails';

export type MetricRuleDetailsFormProps = {
  applicationId: string;
  defaultValues: MetricRuleFormValues;
  disableMetrics?: boolean;
  onSubmit: (data: MetricRuleFormValues) => Promise<void>;
  onCancel: () => void;
};

export type MetricRuleFormValues = {
  name: string;
  metricName: string;
  metricStatistic: string;
  metricTags: string[];
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

  const metricName = useWatch<MetricRuleFormValues>({
    control: control,
    name: 'metricName',
    defaultValue: defaultValues.metricName,
  }) as string;
  const metricTags = useWatch<MetricRuleFormValues>({
    control: control,
    name: 'metricTags',
    defaultValue: defaultValues.metricTags,
  }) as string[];
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

  const getMetricsState = useGetApplicationMetricsQuery({ applicationId: applicationId });
  const getMetricDetailsState = useGetApplicationMetricDetailsQuery(
    {
      applicationId: applicationId,
      name: metricName,
    },
    { enabled: !!metricName }
  );

  useEffect(() => {
    if (disableMetrics) {
      return;
    }

    const metricDetails = getMetricDetailsState.data;
    if (!metricDetails) {
      return;
    }

    const measurement = metricDetails.measurements?.[0];
    if (!measurement) {
      return;
    }

    setValue('metricStatistic', measurement.statistic);
    setValue('metricTags', []);
  }, [getMetricDetailsState.data]);

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

          <Divider sx={{ mt: 2, mb: 1 }} />

          <Controller
            name="metricName"
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
                  label={<FormattedMessage id="metric" />}
                  select
                  error={invalid}
                  helperText={error?.message}
                  disabled={disableMetrics || getMetricsState.isLoading}
                  InputProps={{
                    startAdornment: getMetricsState.isLoading ? (
                      <InputAdornment position="start">
                        <CircularProgress size={20} />
                      </InputAdornment>
                    ) : undefined,
                  }}
                >
                  {getMetricsState.data?.map((metric) => (
                    <MenuItem value={metric.name} key={metric.name}>
                      {metric.name}
                    </MenuItem>
                  )) || (
                    <MenuItem value={''} disabled>
                      <FormattedMessage id={'loading'} />
                    </MenuItem>
                  )}
                </TextField>
              );
            }}
          />

          <Controller
            name="metricStatistic"
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
                  label={<FormattedMessage id="statistic" />}
                  select
                  error={invalid}
                  helperText={error?.message}
                  disabled={disableMetrics || !metricName || getMetricDetailsState.isLoading}
                  InputProps={{
                    startAdornment: getMetricDetailsState.isFetching ? (
                      <InputAdornment position="start">
                        <CircularProgress size={20} />
                      </InputAdornment>
                    ) : undefined,
                  }}
                >
                  {getMetricDetailsState.data?.measurements?.map((measurement) => (
                    <MenuItem value={measurement.statistic} key={measurement.statistic}>
                      {measurement.statistic}
                    </MenuItem>
                  )) || (
                    <MenuItem value={''} disabled>
                      <FormattedMessage id={'loading'} />
                    </MenuItem>
                  )}
                </TextField>
              );
            }}
          />

          <Controller
            name="metricTags"
            control={control}
            render={({ field: { ref, ...field }, fieldState: { invalid, error } }) => {
              return (
                <TextField
                  {...field}
                  inputRef={ref}
                  margin="normal"
                  fullWidth
                  label={<FormattedMessage id="tags" />}
                  select
                  error={invalid}
                  helperText={error?.message}
                  disabled={disableMetrics || !metricName || getMetricDetailsState.isLoading}
                  InputProps={{
                    startAdornment: getMetricDetailsState.isFetching ? (
                      <InputAdornment position="start">
                        <CircularProgress size={20} />
                      </InputAdornment>
                    ) : undefined,
                  }}
                  SelectProps={{
                    multiple: true,
                  }}
                >
                  {getMetricDetailsState.data?.availableTags
                    ?.flatMap((tagValues) => [
                      { type: 'Group', name: tagValues.tag, value: '' },
                      ...tagValues.values.map((value) => ({ type: 'Item', name: tagValues.tag, value })),
                    ])
                    ?.map((item) => {
                      const tagValue = `${item.name}=${item.value}`;
                      const disabled = !!metricTags.find((tag) => tag !== tagValue && tag.startsWith(`${item.name}=`));
                      return item.type === 'Group' ? (
                        <ListSubheader key={item.name}>{item.name}</ListSubheader>
                      ) : (
                        <MenuItem value={tagValue} disabled={disabled} key={tagValue}>
                          {item.value}
                        </MenuItem>
                      );
                    }) || (
                    <MenuItem value={''} disabled>
                      <FormattedMessage id={'loading'} />
                    </MenuItem>
                  )}
                </TextField>
              );
            }}
          />

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
