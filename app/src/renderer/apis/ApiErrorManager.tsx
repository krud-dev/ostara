import React, { FunctionComponent, useCallback, useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { useSnackbar, VariantType } from 'notistack';
import { getErrorMessage } from '../utils/errorUtils';
import { useQueryClient } from '@tanstack/react-query';

export const disableGlobalErrorMeta = { disableGlobalError: true };

interface ApiErrorManagerProps {}

const ApiErrorManager: FunctionComponent<ApiErrorManagerProps> = () => {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  const [apiError, setApiError] = useState<unknown | undefined>(undefined);

  useEffect(() => {
    queryClient.getQueryCache().config.onError = (error, query) => {
      // If this query has a noError meta, skip error
      if (query.options.meta?.disableGlobalError) return;

      setApiError(error);
    };
    queryClient.getMutationCache().config.onError = (error, _variables, _context, mutation) => {
      // If this mutation has a noError meta, skip error
      if (mutation.options.meta?.disableGlobalError) return;

      setApiError(error);
    };
  }, []);

  useEffect(() => {
    if (apiError) {
      notificationHandler(apiError);
      setApiError(undefined);
    }
  }, [apiError]);

  const notificationHandler = useCallback(
    (error: any) => {
      const errorMessage =
        error?.response?.data?.message || error?.response?.data?.errors?.join(', ') || getErrorMessage(error);
      const status = error?.response?.status;
      const variant: VariantType = status === 400 ? 'warning' : 'error';

      enqueueSnackbar(errorMessage || <FormattedMessage id={'networkConnectionLost'} />, { variant });
    },
    [enqueueSnackbar]
  );

  return null;
};

export default ApiErrorManager;
