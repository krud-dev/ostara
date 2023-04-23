import * as React from 'react';
import { useCallback, useMemo } from 'react';
import { Alert, Button, Link } from '@mui/material';
import { SxProps } from '@mui/system';
import { Theme } from '@mui/material/styles';
import { FormattedMessage } from 'react-intl';
import { REDACTION_DOCUMENTATION_URL } from '../../constants/ui';
import { useLocalStorageState } from '../../hooks/useLocalStorageState';

export type RedactionAlertProps = {
  localStorageKeySuffix?: string;
  onDismiss?: () => void;
  sx?: SxProps<Theme>;
};

const RedactionAlert = ({ localStorageKeySuffix = 'default', onDismiss, sx }: RedactionAlertProps) => {
  const localStorageKey = useMemo<string>(
    () => `redactionAlertDismissed_${localStorageKeySuffix}`,
    [localStorageKeySuffix]
  );
  const [dismissed, setDismissed] = useLocalStorageState<boolean>(localStorageKey, false);

  const dismissHandler = useCallback((): void => {
    setDismissed(true);
    onDismiss?.();
  }, []);

  if (dismissed) {
    return null;
  }

  return (
    <Alert
      severity={'warning'}
      variant={'outlined'}
      action={
        <Button color="inherit" size="small" sx={{ textTransform: 'uppercase' }} onClick={dismissHandler}>
          <FormattedMessage id={'dismiss'} />
        </Button>
      }
      sx={sx}
    >
      <FormattedMessage
        id="valuesMaskedLearnMore"
        values={{
          learnMore: (
            <Link href={REDACTION_DOCUMENTATION_URL} color={'warning.main'} target="_blank" rel="noopener noreferrer">
              <FormattedMessage id={'learnMore'} />
            </Link>
          ),
        }}
      />
    </Alert>
  );
};

export default RedactionAlert;
