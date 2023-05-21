import React, { FunctionComponent, useCallback, useEffect, useMemo, useState } from 'react';
import NiceModal, { NiceModalHocProps, useModal } from '@ebay/nice-modal-react';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText } from '@mui/material';
import DialogTitleEnhanced from '../dialog/DialogTitleEnhanced';
import { FormattedMessage } from 'react-intl';
import Markdown from '../code/Markdown';
import { useAnalytics } from '../../contexts/AnalyticsContext';
import { useSettings } from '../../contexts/SettingsContext';
import { UpdateInfo } from 'electron-updater';
import { isString } from 'lodash';
import { notEmpty } from '../../utils/objectUtils';
import { useLocalStorageState } from '../../hooks/useLocalStorageState';
import { LATEST_RELEASE_URL } from '../../constants/ui';

interface AppUpdatesManagerProps {}

const AppUpdatesManager: FunctionComponent<AppUpdatesManagerProps> = () => {
  const { autoUpdateSupported, autoUpdateEnabled, newVersionDownloaded, newVersionInfo } = useSettings();

  const [newVersionDetailsShown, setNewVersionDetailsShown] = useState<string | undefined>(undefined);
  const [newVersionDetailsSkipVersion, setNewVersionDetailsSkipVersion] = useLocalStorageState<string | undefined>(
    'newVersionDetailsSkipVersion',
    undefined
  );
  const [newVersionDownloadedShown, setNewVersionDownloadedShown] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (!newVersionInfo) {
      return;
    }
    if (newVersionDetailsShown === newVersionInfo.version) {
      return;
    }
    if (newVersionDetailsSkipVersion === newVersionInfo.version) {
      return;
    }
    if (autoUpdateSupported && (autoUpdateEnabled || newVersionDownloaded)) {
      return;
    }
    setNewVersionDetailsShown(newVersionInfo.version);
    NiceModal.show<undefined>(AppUpdateDetailsDialog, {
      updateInfo: newVersionInfo,
      onSkipVersion: setNewVersionDetailsSkipVersion,
    });
  }, [newVersionInfo]);

  useEffect(() => {
    if (!newVersionDownloaded) {
      return;
    }
    if (newVersionDownloadedShown === newVersionDownloaded.version) {
      return;
    }
    if (!autoUpdateSupported) {
      return;
    }
    setNewVersionDownloadedShown(newVersionDownloaded.version);
    NiceModal.show<undefined>(AppUpdateDownloadedDialog, { updateInfo: newVersionDownloaded });
  }, [newVersionDownloaded]);

  return null;
};

export default AppUpdatesManager;

type AppUpdateDetailsDialogProps = {
  updateInfo: UpdateInfo;
  onSkipVersion?: (version: string) => void;
};

const AppUpdateDetailsDialog: FunctionComponent<AppUpdateDetailsDialogProps & NiceModalHocProps> = NiceModal.create(
  ({ updateInfo, onSkipVersion }) => {
    const modal = useModal();
    const { track } = useAnalytics();
    const { autoUpdateSupported } = useSettings();

    const closeHandler = useCallback((): void => {
      modal.resolve(undefined);
      modal.hide();
    }, [modal]);

    const markdown = useMemo<string>(() => {
      const { releaseNotes } = updateInfo;
      if (!releaseNotes) {
        return '';
      }
      if (isString(releaseNotes)) {
        return releaseNotes;
      }
      return releaseNotes
        .map((n) => n.note)
        .filter(notEmpty)
        .join('\n');
    }, []);

    useEffect(() => {
      track({ name: 'app_update_details_dialog_show', properties: { version: updateInfo.version } });
    }, []);

    const downloadHandler = useCallback((): void => {
      track({ name: 'app_update_details_dialog_download' });

      if (autoUpdateSupported) {
        window.appUpdater.downloadUpdate();
      } else {
        window.open(LATEST_RELEASE_URL, '_blank');
      }

      closeHandler();
    }, [autoUpdateSupported, closeHandler]);

    const laterHandler = useCallback((): void => {
      track({ name: 'app_update_details_dialog_later' });

      closeHandler();
    }, [closeHandler]);

    const skipVersionHandler = useCallback((): void => {
      track({ name: 'app_update_details_dialog_skip' });

      onSkipVersion?.(updateInfo.version);
      closeHandler();
    }, [onSkipVersion, closeHandler]);

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
          <FormattedMessage id={'appUpdateAvailable'} /> ({updateInfo.version})
        </DialogTitleEnhanced>
        <DialogContent>
          <DialogContentText>
            <FormattedMessage id={'newVersionIsAvailable'} values={{ version: updateInfo.version }} />
          </DialogContentText>
          <Markdown>{markdown}</Markdown>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" color="inherit" onClick={skipVersionHandler}>
            <FormattedMessage id={'skipVersion'} />
          </Button>
          <Box sx={{ flexGrow: 1 }} />
          <Button variant="outlined" color="primary" onClick={laterHandler}>
            <FormattedMessage id={'later'} />
          </Button>
          <Button variant="contained" color="primary" onClick={downloadHandler}>
            <FormattedMessage id={'download'} />
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
);

type AppUpdateDownloadedDialogProps = {
  updateInfo: UpdateInfo;
};

const AppUpdateDownloadedDialog: FunctionComponent<AppUpdateDownloadedDialogProps & NiceModalHocProps> =
  NiceModal.create(({ updateInfo }) => {
    const modal = useModal();
    const { track } = useAnalytics();

    const closeHandler = useCallback((): void => {
      modal.resolve(undefined);
      modal.hide();
    }, [modal]);

    useEffect(() => {
      track({ name: 'app_update_downloaded_dialog_show' });
    }, []);

    const installHandler = useCallback((): void => {
      track({ name: 'app_update_downloaded_dialog_install' });

      window.appUpdater.quitAndInstall();
      closeHandler();
    }, [closeHandler]);

    const laterHandler = useCallback((): void => {
      track({ name: 'app_update_downloaded_dialog_later' });

      closeHandler();
    }, [closeHandler]);

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
          <FormattedMessage id={'appUpdateReady'} /> ({updateInfo.version})
        </DialogTitleEnhanced>
        <DialogContent>
          <DialogContentText>
            <FormattedMessage id={'appUpdateDownloadedAndReady'} />
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Box sx={{ flexGrow: 1 }} />
          <Button variant="outlined" color="primary" onClick={laterHandler}>
            <FormattedMessage id={'later'} />
          </Button>
          <Button variant="contained" color="primary" onClick={installHandler}>
            <FormattedMessage id={'quitAndInstall'} />
          </Button>
        </DialogActions>
      </Dialog>
    );
  });
