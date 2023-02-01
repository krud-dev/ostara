import React, { useCallback, useState } from 'react';
import { Stack, ToggleButton } from '@mui/material';
import { useUpdateEffect } from 'react-use';
import { IconViewer } from 'renderer/components/common/IconViewer';
import { FormattedMessage } from 'react-intl';

export type LoggerCustomFilters = {
  configured?: boolean;
  classes?: boolean;
};

type LoggerCustomFiltersComponentProps = {
  onChange?: (customFilters?: LoggerCustomFilters) => void;
};

export default function LoggerCustomFiltersComponent({ onChange }: LoggerCustomFiltersComponentProps) {
  const [customFilters, setCustomFilters] = useState<LoggerCustomFilters>({});

  useUpdateEffect(() => {
    onChange?.(customFilters?.configured || customFilters?.classes ? customFilters : undefined);
  }, [customFilters]);

  const configuredChangeHandler = useCallback((): void => {
    setCustomFilters((prev) => ({ ...prev, configured: !prev.configured }));
  }, [setCustomFilters]);

  const classesChangeHandler = useCallback((): void => {
    setCustomFilters((prev) => ({ ...prev, classes: !prev.classes }));
  }, [setCustomFilters]);

  return (
    <Stack direction={'row'} spacing={1} alignItems={'center'}>
      <ToggleButton
        value={'configured'}
        size={'small'}
        selected={customFilters?.configured}
        onChange={configuredChangeHandler}
        sx={{ py: 1 }}
      >
        <FormattedMessage id={'configured'} />
      </ToggleButton>
      <ToggleButton
        value={'classes'}
        size={'small'}
        selected={customFilters?.classes}
        onChange={classesChangeHandler}
        sx={{ py: 1 }}
      >
        <FormattedMessage id={'classes'} />
      </ToggleButton>
    </Stack>
  );
}
