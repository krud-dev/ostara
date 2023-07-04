import React, { useMemo } from 'react';
import { Box, Chip, Stack, Tooltip, Typography } from '@mui/material';
import { COMPONENTS_SPACING, NAVIGATOR_ITEM_HEIGHT } from 'renderer/constants/ui';
import { AgentRO } from 'common/generated_definitions';
import { FormattedMessage } from 'react-intl';
import { useUpdateEffect } from 'react-use';
import { isItemInactive } from 'renderer/utils/itemUtils';
import { useGetAgentInfoQuery } from 'renderer/apis/requests/agent/getAgentInfo';

type AgentServiceDiscoveryStrategiesProps = { item: AgentRO };

export default function AgentServiceDiscoveryStrategies({ item }: AgentServiceDiscoveryStrategiesProps) {
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
    if (!infoState.data.serviceDiscoveryStrategies?.length) {
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
            <FormattedMessage id={'errorLoadingStrategies'} />
          </Typography>
        )}
        {uiStatus === 'loading' && (
          <Typography variant={'caption'} sx={{ color: 'text.secondary', px: COMPONENTS_SPACING }}>
            <FormattedMessage id={'loadingStrategies'} />
          </Typography>
        )}
        {uiStatus === 'empty' && (
          <Typography variant={'caption'} sx={{ color: 'text.secondary', px: COMPONENTS_SPACING }}>
            <FormattedMessage id={'noServiceDiscoveryStrategies'} />
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
            {infoState.data?.serviceDiscoveryStrategies?.map((strategy) => (
              <Tooltip title={<FormattedMessage id={'agentServiceDiscoveryStrategies'} />} key={strategy.type}>
                <Chip label={strategy.type} color={'default'} />
              </Tooltip>
            ))}
          </Stack>
        )}
      </>
    </Box>
  );
}
