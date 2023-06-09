import { FormattedMessage, useIntl } from 'react-intl';
import React, { FunctionComponent, useEffect, useMemo, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { Autocomplete, Box, Chip, CircularProgress, ListSubheader, MenuItem, TextField } from '@mui/material';
import InputAdornment from '@mui/material/InputAdornment';
import { useGetApplicationMetricsQuery } from 'renderer/apis/requests/application/metrics/getApplicationMetrics';
import { useGetApplicationMetricDetailsQuery } from 'renderer/apis/requests/application/metrics/getApplicationMetricDetails';
import { MetricActuatorResponse } from 'common/generated_definitions';
import { isEmpty } from 'lodash';
import { getMetricTagFullName } from 'renderer/utils/metricUtils';

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
  const metricStatistic = watch(metricStatisticFieldName) as string;
  const metricTags = watch(metricTagsFieldName) as string[];
  const metricTagsObject = useMemo<{ [key: string]: string }>(
    () =>
      metricTags.reduce((result: { [key: string]: string }, str: string) => {
        const [key, value] = str.split('=');
        result[key] = value;
        return result;
      }, {}),
    [metricTags]
  );

  const getMetricsState = useGetApplicationMetricsQuery({ applicationId: applicationId });

  const metricOptions = useMemo<string[]>(
    () => getMetricsState.data?.map((metric) => metric.name) || [],
    [getMetricsState.data]
  );

  const [metricDetails, setMetricDetails] = useState<MetricActuatorResponse | undefined>(undefined);
  const [metricDetailsValue, setMetricDetailsValue] = useState<MetricActuatorResponse | undefined>(undefined);
  const availableTags = useMemo<string[]>(
    () =>
      metricDetailsValue?.availableTags?.flatMap((tag) =>
        tag.values.map((value) => getMetricTagFullName(tag.tag, value))
      ) || [],
    [metricDetailsValue]
  );

  const getMetricDetailsState = useGetApplicationMetricDetailsQuery(
    {
      applicationId: applicationId,
      name: metricName,
      tags: metricTagsObject,
    },
    { enabled: !!metricName }
  );

  useEffect(() => {
    const result = getMetricDetailsState.data;
    if (result) {
      if (!metricDetails || metricDetails.name !== result.name) {
        setMetricDetails(result);
      }
      setMetricDetailsValue(result);
    }
  }, [getMetricDetailsState.data]);

  useEffect(() => {
    if (disabled) {
      return;
    }

    setMetricDetails(undefined);
    setMetricDetailsValue(undefined);
    setValue(metricStatisticFieldName, '');
    setValue(metricTagsFieldName, []);
  }, [metricName]);

  useEffect(() => {
    if (disabled) {
      return;
    }

    if (!metricDetails) {
      return;
    }

    const statistic = metricDetails.measurements?.[0]?.statistic;
    if (statistic) {
      setValue(metricStatisticFieldName, statistic);
    }
  }, [metricDetails]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2 }}>
      <Controller
        name={metricNameFieldName}
        rules={{
          required: intl.formatMessage({ id: 'requiredField' }),
        }}
        control={control}
        render={({ field: { ref, value, onChange, ...field }, fieldState: { invalid, error } }) => {
          return (
            <Autocomplete
              {...field}
              ref={ref}
              value={value || null}
              onChange={(event, newValue) => {
                onChange(newValue);
              }}
              options={metricOptions}
              getOptionLabel={(option) => option}
              fullWidth
              renderInput={(params) => (
                <TextField
                  {...params}
                  margin="normal"
                  required
                  label={<FormattedMessage id={namePrefix} />}
                  error={invalid}
                  helperText={
                    error?.message || (
                      <MetricDescription metricDetails={metricDetailsValue} metricStatistic={metricStatistic} />
                    )
                  }
                  disabled={disabled || getMetricsState.isLoading}
                  InputProps={{
                    ...params.InputProps,
                    startAdornment: getMetricsState.isLoading ? (
                      <InputAdornment position="start">
                        <CircularProgress size={20} />
                      </InputAdornment>
                    ) : (
                      params.InputProps?.startAdornment
                    ),
                  }}
                />
              )}
            />
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
                  disabled={disabled || !metricDetails}
                  InputProps={{
                    startAdornment: !metricDetails ? (
                      <InputAdornment position="start">
                        <CircularProgress size={20} />
                      </InputAdornment>
                    ) : undefined,
                  }}
                >
                  {metricDetails?.measurements?.map((measurement) => (
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
                  disabled={disabled || !metricDetails}
                  InputProps={{
                    startAdornment: !metricDetails ? (
                      <InputAdornment position="start">
                        <CircularProgress size={20} />
                      </InputAdornment>
                    ) : undefined,
                  }}
                  SelectProps={{
                    multiple: true,
                    renderValue: (selected) => {
                      const values = selected as string[];
                      return isEmpty(values) ? undefined : (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {values.map((value: string) => (
                            <Chip
                              size={'small'}
                              label={value}
                              onDelete={() => {
                                field.onChange(values.filter((v) => v !== value));
                              }}
                              onMouseDown={(event) => {
                                event.stopPropagation();
                                event.preventDefault();
                              }}
                              sx={{ height: 23 }}
                              key={value}
                            />
                          ))}
                        </Box>
                      );
                    },
                  }}
                >
                  {metricDetails?.availableTags
                    ?.flatMap((tagValues) => [
                      { type: 'Group', name: tagValues.tag, value: '' },
                      ...tagValues.values.map((value) => ({ type: 'Item', name: tagValues.tag, value })),
                    ])
                    ?.map((item) => {
                      const tagValue = getMetricTagFullName(item.name, item.value);
                      const tagDisabled =
                        !metricTags.includes(tagValue) &&
                        (getMetricDetailsState.isFetching ||
                          !availableTags.includes(tagValue) ||
                          !!metricTags.find((tag) => tag.startsWith(`${item.name}=`)));
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

export type MetricDescriptionProps = {
  metricDetails?: MetricActuatorResponse;
  metricStatistic?: string;
};

const MetricDescription: FunctionComponent<MetricDescriptionProps> = ({ metricDetails, metricStatistic }) => {
  const description = useMemo<string>(() => metricDetails?.description || '', [metricDetails]);
  const currentValue = useMemo<string>(
    () => metricDetails?.measurements?.find((m) => m.statistic === metricStatistic)?.value?.toString() || '',
    [metricDetails, metricStatistic]
  );
  return (
    <>
      {description && (
        <Box component={'span'} sx={{ display: 'block' }}>
          {description}
        </Box>
      )}
      {currentValue && (
        <Box component={'span'} sx={{ display: 'block' }}>
          <FormattedMessage id="currentValue" />
          {': '}
          {currentValue}
        </Box>
      )}
    </>
  );
};

export default MetricSelectionForm;
