import React, { useMemo } from 'react';
import { Box, Chip, Stack, Tooltip, Typography } from '@mui/material';
import { COMPONENTS_SPACING, NAVIGATOR_ITEM_HEIGHT } from 'renderer/constants/ui';
import { InstanceRO } from '../../../../common/generated_definitions';
import { FormattedMessage } from 'react-intl';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { useGetInstanceEnvQuery } from '../../../apis/requests/instance/env/getInstanceEnv';
import { useUpdateEffect } from 'react-use';

type InstanceActiveProfilesProps = { item: InstanceRO };

export default function InstanceActiveProfiles({ item }: InstanceActiveProfilesProps) {
  const envState = useGetInstanceEnvQuery({ instanceId: item.id });

  useUpdateEffect(() => {
    envState.refetch();
  }, [item.health.status]);

  const error = useMemo(() => envState.error, [envState]);
  const activeProfiles = useMemo<string[] | undefined>(
    () => (error ? undefined : envState.data?.activeProfiles),
    [envState, error]
  );
  const loading = useMemo(() => !activeProfiles && !error, [activeProfiles, error]);
  const empty = useMemo(() => !!activeProfiles && activeProfiles.length === 0 && !error, [activeProfiles, error]);

  return (
    <Box
      sx={{
        height: NAVIGATOR_ITEM_HEIGHT,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}
    >
      <>
        {error && (
          <Typography variant={'caption'} sx={{ color: 'error.main', px: COMPONENTS_SPACING }}>
            <FormattedMessage id={'errorLoadingActiveProfiles'} />
          </Typography>
        )}
        {loading && (
          <Typography variant={'caption'} sx={{ color: 'text.secondary', px: COMPONENTS_SPACING }}>
            <FormattedMessage id={'loadingActiveProfiles'} />
          </Typography>
        )}
        {empty && (
          <Typography variant={'caption'} sx={{ color: 'text.secondary', px: COMPONENTS_SPACING }}>
            <FormattedMessage id={'noActiveProfiles'} />
          </Typography>
        )}
        {activeProfiles && !empty && (
          <Box sx={{ width: '100%' }}>
            <PerfectScrollbar options={{ wheelPropagation: true, suppressScrollY: true }}>
              <Stack
                direction={'row'}
                spacing={1}
                alignItems={'center'}
                sx={{ height: '100%', display: 'inline-flex', px: COMPONENTS_SPACING }}
              >
                {activeProfiles.map((profile) => (
                  <Tooltip title={<FormattedMessage id={'activeProfile'} />} key={profile}>
                    <Chip label={profile} size={'small'} color={'default'} />
                  </Tooltip>
                ))}
              </Stack>
            </PerfectScrollbar>
          </Box>
        )}
      </>
    </Box>
  );
}
