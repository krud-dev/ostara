import React, { FunctionComponent, useCallback, useEffect, useMemo } from 'react';
import { useLocalStorageState } from 'renderer/hooks/useLocalStorageState';
import NiceModal, { NiceModalHocProps, useModal } from '@ebay/nice-modal-react';
import { Dialog, DialogContent } from '@mui/material';
import DialogTitleEnhanced from 'renderer/components/dialog/DialogTitleEnhanced';
import { FormattedMessage } from 'react-intl';
import changelog from '../../../../../CHANGELOG.md';
import Markdown from '../code/Markdown';
import { useAnalyticsContext } from '../../contexts/AnalyticsContext';

interface NewVersionManagerProps {}

const NewVersionManager: FunctionComponent<NewVersionManagerProps> = () => {
  const { track } = useAnalyticsContext();

  const [lastAppVersion, setLastAppVersion] = useLocalStorageState<string | undefined>('lastAppVersion', undefined);

  useEffect(() => {
    (async () => {
      const appVersion = await window.ui.getAppVersion();

      if (!lastAppVersion) {
        track({ name: 'app_first_open', properties: { version: appVersion } });
      }

      if (appVersion !== lastAppVersion) {
        if (lastAppVersion) {
          NiceModal.show<undefined, NewVersionDialogProps>(NewVersionDialog, { appVersion });
          track({ name: 'app_update_completed', properties: { version: appVersion } });
        }
        setLastAppVersion(appVersion);
      }
    })();
  }, []);

  return null;
};

export default NewVersionManager;

type NewVersionDialogProps = {
  appVersion: string;
} & NiceModalHocProps;

const NewVersionDialog: FunctionComponent<NewVersionDialogProps> = NiceModal.create(({ appVersion }) => {
  const modal = useModal();

  const closeHandler = useCallback((): void => {
    modal.resolve(undefined);
    modal.hide();
  }, [modal]);

  const markdown = useMemo<string>(() => changelog.split('\n').slice(2).join('\n'), []);

  return (
    <Dialog
      open={modal.visible}
      onClose={closeHandler}
      TransitionProps={{
        onExited: () => modal.remove(),
      }}
      fullWidth
      maxWidth={'xs'}
    >
      <DialogTitleEnhanced onClose={closeHandler}>
        <FormattedMessage id={'appVersionUpdated'} /> ({appVersion}) &#x1F381;
      </DialogTitleEnhanced>
      <DialogContent>
        <Markdown>{markdown}</Markdown>
      </DialogContent>
    </Dialog>
  );
});
