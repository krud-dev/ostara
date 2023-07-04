import React, { useMemo } from 'react';
import { Box, Chip, Stack, Tooltip, Typography } from '@mui/material';
import { COMPONENTS_SPACING, NAVIGATOR_ITEM_HEIGHT } from 'renderer/constants/ui';
import { AgentRO } from 'common/generated_definitions';
import { FormattedMessage } from 'react-intl';
import { useUpdateEffect } from 'react-use';
import { isItemInactive } from 'renderer/utils/itemUtils';
import { useGetAgentInfoQuery } from 'renderer/apis/requests/agent/getAgentInfo';

type AgentSourcesProps = { item: AgentRO };

export default function AgentSources({ item }: AgentSourcesProps) {
  const agentInactive = useMemo<boolean>(() => isItemInactive(item), [item]);

  const infoState = useGetAgentInfoQuery(
    { agentId: item.id },
    { enabled: !agentInactive, disableGlobalError: true, refetchInterval: 1000 * 60 * 5 }
  );

  useUpdateEffect(() => {
    if (!agentInactive) {
      infoState.refetch();
    }
  }, [agentInactive]);

  const uiStatus = useMemo<'error' | 'success' | 'loading' | 'empty' | 'inactive'>(() => {
    if (agentInactive) {
      return 'inactive';
    }
    if (infoState.error) {
      return 'error';
    }
    if (!infoState.data) {
      return 'loading';
    }
    if (!infoState.data.sources?.length) {
      return 'empty';
    }
    return 'success';
  }, [agentInactive, infoState]);

  return (
    <Box
      sx={{
        minHeight: NAVIGATOR_ITEM_HEIGHT,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}
    >
      <>
        {uiStatus === 'inactive' && (
          <Typography variant={'caption'} sx={{ color: 'text.secondary', px: COMPONENTS_SPACING }}>
            <FormattedMessage id={'cannotConnectToAgent'} />
          </Typography>
        )}
        {uiStatus === 'error' && (
          <Typography variant={'caption'} sx={{ color: 'error.main', px: COMPONENTS_SPACING }}>
            <FormattedMessage id={'errorLoadingSources'} />
          </Typography>
        )}
        {uiStatus === 'loading' && (
          <Typography variant={'caption'} sx={{ color: 'text.secondary', px: COMPONENTS_SPACING }}>
            <FormattedMessage id={'loadingAgentSources'} />
          </Typography>
        )}
        {uiStatus === 'empty' && (
          <Typography variant={'caption'} sx={{ color: 'text.secondary', px: COMPONENTS_SPACING }}>
            <FormattedMessage id={'noAgentSources'} />
          </Typography>
        )}
        {uiStatus === 'success' && (
          <Stack
            direction={'row'}
            spacing={1}
            alignItems={'center'}
            useFlexGap
            flexWrap={'wrap'}
            sx={{ height: '100%', px: COMPONENTS_SPACING, py: 0.5 }}
          >
            {infoState.data?.sources?.map((source) => (
              <Tooltip title={<FormattedMessage id={'agentSources'} />} key={source}>
                <Chip label={source} color={'default'} />
              </Tooltip>
            ))}
          </Stack>
        )}
      </>
    </Box>
  );
}
