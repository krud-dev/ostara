import React, { useCallback, useMemo, useRef, useState } from 'react';
import { Box, Button, Divider, Stack, Typography } from '@mui/material';
import { SIDEBAR_HEADER_HEIGHT } from 'renderer/constants/ui';
import NavigatorTree from 'renderer/layout/navigator/components/sidebar/tree/NavigatorTree';
import SearchTextField from 'renderer/components/input/SearchTextField';
import { FilterListOutlined } from '@mui/icons-material';
import CreateItemMenu from 'renderer/layout/navigator/components/sidebar/menus/CreateItemMenu';
import SearchItemMenu from 'renderer/layout/navigator/components/sidebar/menus/SearchItemMenu';
import CreateItemContextMenu from 'renderer/layout/navigator/components/sidebar/menus/CreateItemContextMenu';
import AutoSizer, { VerticalSize } from 'react-virtualized-auto-sizer';
import { FormattedMessage } from 'react-intl';
import { useItemsContext } from 'renderer/contexts/ItemsContext';
import { useNavigate } from 'react-router-dom';
import { urls } from 'renderer/routes/urls';

type NavigatorSidebarProps = {
  width: number;
};

export default function NavigatorSidebar({ width }: NavigatorSidebarProps) {
  const { agents } = useItemsContext();
  const navigate = useNavigate();

  const [search, setSearch] = useState<string>('');

  const contextMenuRef = useRef<HTMLElement>(null);

  const agentsCount = useMemo<string | undefined>(() => (agents ? agents.length.toString() : undefined), [agents]);

  const manageAgentsHandler = useCallback((): void => {
    navigate(urls.agents.url);
  }, [navigate]);

  return (
    <>
      <CreateItemContextMenu contextMenuRef={contextMenuRef} />

      <Box sx={{ height: '100%', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <Box
          sx={{
            height: SIDEBAR_HEADER_HEIGHT,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Stack direction={'row'} spacing={0.25} alignItems={'center'} sx={{ flexGrow: 1, px: 0.25 }}>
            <Box>
              <CreateItemMenu />
            </Box>
            <SearchTextField
              size={'small'}
              icon={FilterListOutlined}
              placeholder={''}
              value={search}
              onChangeValue={setSearch}
            />
            <Box>
              <SearchItemMenu />
            </Box>
          </Stack>
        </Box>

        <Box sx={{ flexGrow: 1 }} ref={contextMenuRef}>
          <AutoSizer disableWidth>
            {({ height }: VerticalSize) => <NavigatorTree width={width} height={height} search={search} />}
          </AutoSizer>
        </Box>

        <Divider />

        <Stack direction={'row'} alignItems={'center'} justifyContent={'space-between'} sx={{ height: 60, px: 2 }}>
          <Typography
            variant={'body2'}
            sx={{ color: 'text.secondary', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
          >
            <FormattedMessage id={'agents'} />
            {agentsCount ? ` (${agentsCount})` : ''}
          </Typography>
          <Button size={'small'} variant={'outlined'} color={'inherit'} onClick={manageAgentsHandler}>
            <FormattedMessage id={'manage'} />
          </Button>
        </Stack>
      </Box>
    </>
  );
}
