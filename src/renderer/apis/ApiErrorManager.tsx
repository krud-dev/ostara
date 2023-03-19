import React, { FunctionComponent, useCallback, useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import { useSnackbar } from 'notistack';
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
      const errorMessage = getErrorMessage(error);
      enqueueSnackbar(errorMessage || <FormattedMessage id={'networkConnectionLost'} />, {
        variant: 'error',
      });
    },
    [enqueueSnackbar]
  );

  return null;
};

export default ApiErrorManager;
