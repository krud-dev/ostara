import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useSubscribeToEvent } from 'renderer/apis/requests/subscriptions/subscribeToEvent';
import { IpcRendererEvent } from 'electron';
import NavbarIconButton from './NavbarIconButton';
import { useLocation, useNavigate } from 'react-router-dom';
import { urls } from 'renderer/routes/urls';
import { getUrlInfo } from 'renderer/utils/urlUtils';

export default function SettingsMenu() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const [settingsPagesCounter, setSettingsPagesCounter] = useState<number>(0);

  const isSettingsPathname = useCallback((pathnameToCheck: string): boolean => {
    return pathnameToCheck.startsWith(urls.settings.url);
  }, []);

  useEffect(() => {
    if (isSettingsPathname(pathname)) {
      const urlInfo = getUrlInfo(pathname);
      if (!urlInfo?.redirect) {
        setSettingsPagesCounter((prev) => prev + 1);
      }
    } else {
      setSettingsPagesCounter(0);
    }
  }, [pathname]);

  const active = useMemo<boolean>(() => isSettingsPathname(pathname), [pathname]);

  const toggleSettingsHandler = useCallback((): void => {
    if (isSettingsPathname(pathname)) {
      navigate(-settingsPagesCounter);
    } else {
      navigate(urls.settings.url);
    }
  }, [pathname, settingsPagesCounter]);

  const subscribeToTriggerEventsState = useSubscribeToEvent();

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    (async () => {
      unsubscribe = await subscribeToTriggerEventsState.mutateAsync({
        event: 'trigger:openSettings',
        listener: (event: IpcRendererEvent) => {
          toggleSettingsHandler();
        },
      });
    })();
    return () => {
      unsubscribe?.();
    };
  }, []);

  return (
    <NavbarIconButton titleId={'settings'} icon={'SettingsOutlined'} active={active} onClick={toggleSettingsHandler} />
  );
}
