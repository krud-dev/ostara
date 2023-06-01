import { FormattedMessage, useIntl } from 'react-intl';
import React, { FunctionComponent, useEffect, useMemo } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { Box, CircularProgress, ListSubheader, MenuItem, TextField } from '@mui/material';
import InputAdornment from '@mui/material/InputAdornment';
import { useGetApplicationMetricsQuery } from '../../../../../apis/requests/application/metrics/getApplicationMetrics';
import { useGetApplicationMetricDetailsQuery } from '../../../../../apis/requests/application/metrics/getApplicationMetricDetails';

export type MetricSelectionFormProps = {
  namePrefix: string;
  applicationId: string;
  disabled?: boolean;
};

const MetricSelectionForm: FunctionComponent<MetricSelectionFormProps> = ({
  namePrefix,
  applicationId,
  disabled,
}: MetricSelectionFormProps) => {
  const intl = useIntl();

  const { control, setValue, watch } = useFormContext<any>();

  const metricNameFieldName = useMemo<string>(() => `${namePrefix}Name`, [namePrefix]);
  const metricStatisticFieldName = useMemo<string>(() => `${namePrefix}Statistic`, [namePrefix]);
  const metricTagsFieldName = useMemo<string>(() => `${namePrefix}Tags`, [namePrefix]);

  const metricName = watch(metricNameFieldName) as string;
  const metricTags = watch(metricTagsFieldName) as string[];

  const getMetricsState = useGetApplicationMetricsQuery({ applicationId: applicationId });
  const getMetricDetailsState = useGetApplicationMetricDetailsQuery(
    {
      applicationId: applicationId,
      name: metricName,
    },
    { enabled: !!metricName }
  );

  useEffect(() => {
    if (disabled) {
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

    setValue(metricStatisticFieldName, measurement.statistic);
    setValue(metricTagsFieldName, []);
  }, [getMetricDetailsState.data]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2 }}>
      <Controller
        name={metricNameFieldName}
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
              label={<FormattedMessage id={namePrefix} />}
              select
              error={invalid}
              helperText={error?.message}
              disabled={disabled || getMetricsState.isLoading}
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

      {metricName && (
        <>
          <Controller
            name={metricStatisticFieldName}
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
                  disabled={disabled || !metricName || getMetricDetailsState.isLoading}
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
            name={metricTagsFieldName}
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
                  disabled={disabled || !metricName || getMetricDetailsState.isLoading}
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
                      const tagDisabled = !!metricTags.find(
                        (tag) => tag !== tagValue && tag.startsWith(`${item.name}=`)
                      );
                      return item.type === 'Group' ? (
                        <ListSubheader key={item.name}>{item.name}</ListSubheader>
                      ) : (
                        <MenuItem value={tagValue} disabled={tagDisabled} key={tagValue}>
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
        </>
      )}
    </Box>
  );
};

export default MetricSelectionForm;
