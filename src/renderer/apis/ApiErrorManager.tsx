import React, { FunctionComponent, useCallback, useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import { useSnackbar, VariantType } from 'notistack';
import { getErrorMessage } from '../utils/errorUtils';
import { useGlobalQueryClientError } from './useQueryClient';

interface ApiErrorManagerProps {}

const ApiErrorManager: FunctionComponent<ApiErrorManagerProps> = () => {
  const { enqueueSnackbar } = useSnackbar();

  const [globalError, setGlobalError] = useGlobalQueryClientError();

  useEffect(() => {
    if (globalError) {
      notificationHandler(globalError);
      setGlobalError(undefined);
    }
  }, [globalError]);

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
