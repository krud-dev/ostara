import React, { useCallback, useEffect, useState } from 'react';
import { Box, IconButton, Tooltip } from '@mui/material';
import { HelpOutlineOutlined } from '@mui/icons-material';
import { useLocation } from 'react-router-dom';
import { getUrlInfo } from '../../../../utils/urlUtils';
import { useAnalytics } from '../../../../contexts/AnalyticsContext';
import { FormattedMessage } from 'react-intl';
import { NAVBAR_TOOLTIP_DELAY } from '../MainNavbar';

export default function HelpMenu() {
  const { pathname } = useLocation();
  const { track } = useAnalytics();

  const [url, setUrl] = useState<string | undefined>(undefined);

  const openUrlHandler = useCallback((): void => {
    window.open(url, '_blank');

    const urlInfo = getUrlInfo(pathname);
    track({
      name: 'help_documentation_open',
      properties: { help_url: url, page_title: urlInfo?.path, page_location: urlInfo?.url },
    });
  }, [url, pathname]);

  useEffect(() => {
    if (!pathname) {
      setUrl(undefined);
      return;
    }

    const urlInfo = getUrlInfo(pathname);
    if (!urlInfo) {
      setUrl(undefined);
      return;
    }

    setUrl(urlInfo.helpUrl);
  }, [pathname]);

  if (!url) {
    return null;
  }

  return (
    <Box sx={{ '-webkit-app-region': 'no-drag' }}>
      <Tooltip title={<FormattedMessage id={'documentation'} />} enterDelay={NAVBAR_TOOLTIP_DELAY}>
        <IconButton size={'small'} onClick={openUrlHandler} sx={{ color: 'text.primary' }}>
          <HelpOutlineOutlined fontSize={'medium'} />
        </IconButton>
      </Tooltip>
    </Box>
  );
}
