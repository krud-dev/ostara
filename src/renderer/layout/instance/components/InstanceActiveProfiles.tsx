import React, { useMemo } from 'react';
import { Box, Chip, Stack, Tooltip, Typography } from '@mui/material';
import { COMPONENTS_SPACING, NAVIGATOR_ITEM_HEIGHT } from 'renderer/constants/ui';
import { InstanceRO } from '../../../../common/generated_definitions';
import { FormattedMessage } from 'react-intl';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { useGetInstanceEnvQuery } from '../../../apis/requests/instance/env/getInstanceEnv';

type InstanceActiveProfilesProps = { item: InstanceRO };

export default function InstanceActiveProfiles({ item }: InstanceActiveProfilesProps) {
  const envState = useGetInstanceEnvQuery({ instanceId: item.id });

  const activeProfiles = useMemo<string[] | undefined>(() => envState.data?.activeProfiles, [envState]);
  const loading = useMemo(() => !activeProfiles, [activeProfiles]);
  const empty = useMemo(() => !!activeProfiles && activeProfiles.length === 0, [activeProfiles]);

  return (
    <Box
      sx={{
        height: NAVIGATOR_ITEM_HEIGHT,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {loading && (
        <Typography variant={'caption'} sx={{ color: 'text.secondary' }}>
          <FormattedMessage id={'loadingActiveProfiles'} />
        </Typography>
      )}
      {empty && (
        <Typography variant={'caption'} sx={{ color: 'text.secondary' }}>
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
    </Box>
  );
}
