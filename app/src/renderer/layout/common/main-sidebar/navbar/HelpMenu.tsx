import React, { useCallback, useEffect, useState } from 'react';
import { Box, IconButton } from '@mui/material';
import { HelpOutlineOutlined } from '@mui/icons-material';
import { matchPath, useLocation } from 'react-router-dom';
import { findLast } from 'lodash';
import { UrlInfo, urls } from '../../../../routes/urls';

export default function HelpMenu() {
  const { pathname } = useLocation();

  const [url, setUrl] = useState<string | undefined>(undefined);

  const openUrlHandler = useCallback((): void => {
    window.open(url, '_blank');
  }, [url]);

  useEffect(() => {
    if (!pathname) {
      setUrl(undefined);
      return;
    }

    const urlInfo: UrlInfo | undefined = findLast(urls, (u) => !!matchPath({ path: u.url }, pathname));
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
      <IconButton size={'small'} onClick={openUrlHandler} sx={{ color: 'text.primary' }}>
        <HelpOutlineOutlined fontSize={'medium'} />
      </IconButton>
    </Box>
  );
}
