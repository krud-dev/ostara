import React, { FunctionComponent, useEffect } from 'react';
import ReactGA from 'react-ga4';
import { useUi } from '../../contexts/UiContext';
import { GOOGLE_ANALYTICS_MEASUREMENT_ID } from '../../constants/ids';
import { useLocation } from 'react-router-dom';

interface GoogleAnalyticsManagerProps {}

const GoogleAnalyticsManager: FunctionComponent<GoogleAnalyticsManagerProps> = () => {
  const { analyticsEnabled } = useUi();
  const { pathname } = useLocation();

  useEffect(() => {
    if (analyticsEnabled) {
      ReactGA.initialize(GOOGLE_ANALYTICS_MEASUREMENT_ID);
      ReactGA.set({ anonymizeIp: true });
    } else {
      ReactGA.reset();
    }
  }, [analyticsEnabled]);

  useEffect(() => {
    ReactGA.send({ hitType: 'pageview', page: pathname });
  }, [pathname]);

  return null;
};

export default GoogleAnalyticsManager;
