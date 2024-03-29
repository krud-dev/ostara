import React, { useMemo } from 'react';
import { Box, Chip, Stack, Tooltip, Typography } from '@mui/material';
import { COMPONENTS_SPACING, NAVIGATOR_ITEM_HEIGHT } from 'renderer/constants/ui';
import { InstanceRO } from 'common/generated_definitions';
import { FormattedMessage } from 'react-intl';
import { useGetInstanceEnvQuery } from 'renderer/apis/requests/instance/env/getInstanceEnv';
import { useUpdateEffect } from 'react-use';
import { isItemInactive } from 'renderer/utils/itemUtils';

type InstanceActiveProfilesProps = { item: InstanceRO };

export default function InstanceActiveProfiles({ item }: InstanceActiveProfilesProps) {
  const instanceInactive = useMemo<boolean>(() => isItemInactive(item), [item]);
  const instanceLoading = useMemo<boolean>(() => item.health.status === 'PENDING', [item]);

  const envState = useGetInstanceEnvQuery(
    { instanceId: item.id },
    { enabled: !instanceInactive && !instanceLoading, disableGlobalError: true }
  );

  useUpdateEffect(() => {
    if (!instanceInactive && !instanceLoading) {
      envState.refetch();
    }
  }, [instanceInactive, instanceLoading]);

  const uiStatus = useMemo<'error' | 'success' | 'loading' | 'empty' | 'inactive'>(() => {
    if (instanceInactive) {
      return 'inactive';
    }
    if (envState.error) {
      return 'error';
    }
    if (instanceLoading || !envState.data) {
      return 'loading';
    }
    if (!envState.data.activeProfiles?.length) {
      return 'empty';
    }
    return 'success';
  }, [instanceInactive, instanceLoading, envState]);

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
            <FormattedMessage id={'cannotConnectToInstance'} />
          </Typography>
        )}
        {uiStatus === 'error' && (
          <Typography variant={'caption'} sx={{ color: 'error.main', px: COMPONENTS_SPACING }}>
            <FormattedMessage id={'errorLoadingActiveProfiles'} />
          </Typography>
        )}
        {uiStatus === 'loading' && (
          <Typography variant={'caption'} sx={{ color: 'text.secondary', px: COMPONENTS_SPACING }}>
            <FormattedMessage id={'loadingActiveProfiles'} />
          </Typography>
        )}
        {uiStatus === 'empty' && (
          <Typography variant={'caption'} sx={{ color: 'text.secondary', px: COMPONENTS_SPACING }}>
            <FormattedMessage id={'noActiveProfiles'} />
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
            {envState.data?.activeProfiles?.map((profile) => (
              <Tooltip title={<FormattedMessage id={'activeProfile'} />} key={profile}>
                <Chip label={profile} color={'default'} />
              </Tooltip>
            ))}
          </Stack>
        )}
      </>
    </Box>
  );
}
