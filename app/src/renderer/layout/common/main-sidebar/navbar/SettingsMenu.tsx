import React, { useCallback, useEffect } from 'react';
import { useSubscribeToEvent } from 'renderer/apis/requests/subscriptions/subscribeToEvent';
import { IpcRendererEvent } from 'electron';
import NavbarIconButton from './NavbarIconButton';
import { useNavigate } from 'react-router-dom';
import { urls } from 'renderer/routes/urls';

export default function SettingsMenu() {
  const navigate = useNavigate();

  const openSettingsHandler = useCallback((): void => {
    navigate(urls.settings.url);
  }, []);

  const subscribeToTriggerEventsState = useSubscribeToEvent();

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    (async () => {
      unsubscribe = await subscribeToTriggerEventsState.mutateAsync({
        event: 'trigger:openSettings',
        listener: (event: IpcRendererEvent) => {
          openSettingsHandler();
        },
      });
    })();
    return () => {
      unsubscribe?.();
    };
  }, []);

  return <NavbarIconButton titleId={'settings'} icon={'SettingsOutlined'} onClick={openSettingsHandler} />;
}
