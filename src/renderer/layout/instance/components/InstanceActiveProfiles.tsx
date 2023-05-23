import React, { useMemo } from 'react';
import { Box, Chip, Stack, Tooltip, Typography } from '@mui/material';
import { COMPONENTS_SPACING, NAVIGATOR_ITEM_HEIGHT } from 'renderer/constants/ui';
import { InstanceRO } from '../../../../common/generated_definitions';
import { FormattedMessage } from 'react-intl';
import { useGetInstanceEnvQuery } from '../../../apis/requests/instance/env/getInstanceEnv';
import { useUpdateEffect } from 'react-use';
import { isInstanceInactive } from '../../../utils/itemUtils';

type InstanceActiveProfilesProps = { item: InstanceRO };

export default function InstanceActiveProfiles({ item }: InstanceActiveProfilesProps) {
  const instanceInactive = useMemo<boolean>(() => isInstanceInactive(item), [item]);
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

  const status = useMemo<'error' | 'success' | 'loading' | 'empty' | 'inactive'>(() => {
    if (instanceInactive) {
      return 'inactive';
    }
    if (instanceLoading || !envState.data) {
      return 'loading';
    }
    if (envState.error) {
      return 'error';
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
        {status === 'inactive' && (
          <Typography variant={'caption'} sx={{ color: 'text.secondary', px: COMPONENTS_SPACING }}>
            <FormattedMessage id={'cannotConnectToInstance'} />
          </Typography>
        )}
        {status === 'error' && (
          <Typography variant={'caption'} sx={{ color: 'error.main', px: COMPONENTS_SPACING }}>
            <FormattedMessage id={'errorLoadingActiveProfiles'} />
          </Typography>
        )}
        {status === 'loading' && (
          <Typography variant={'caption'} sx={{ color: 'text.secondary', px: COMPONENTS_SPACING }}>
            <FormattedMessage id={'loadingActiveProfiles'} />
          </Typography>
        )}
        {status === 'empty' && (
          <Typography variant={'caption'} sx={{ color: 'text.secondary', px: COMPONENTS_SPACING }}>
            <FormattedMessage id={'noActiveProfiles'} />
          </Typography>
        )}
        {status === 'success' && (
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
