import React, { ReactNode, useCallback, useMemo } from 'react';
import {
  DataCollectionMode,
  EnrichedInstance,
  InstanceDataCollectionMode,
} from 'infra/configuration/model/configuration';
import { Box, Button, Stack, Tooltip, Typography } from '@mui/material';
import { FormattedMessage } from 'react-intl';
import { getDataCollectionModeColor, getDataCollectionModeTextId } from 'renderer/utils/itemUtils';
import { ColorSchema } from 'renderer/theme/config/palette';
import { useUpdateItem } from 'renderer/apis/configuration/item/updateItem';
import { COMPONENTS_SPACING } from 'renderer/constants/ui';

type InstanceDataCollectionToggleProps = { item: EnrichedInstance };

export default function InstanceDataCollectionToggle({ item }: InstanceDataCollectionToggleProps) {
  const color = useMemo<ColorSchema>(
    () => getDataCollectionModeColor(item.effectiveDataCollectionMode),
    [item.effectiveDataCollectionMode]
  );
  const textId = useMemo<string>(
    () => getDataCollectionModeTextId(item.effectiveDataCollectionMode),
    [item.dataCollectionMode]
  );
  const showAsterisk = useMemo<boolean>(() => item.dataCollectionMode !== item.effectiveDataCollectionMode, [item]);
  const tooltip = useMemo<ReactNode>(() => {
    switch (item.dataCollectionMode) {
      case 'on':
        return <FormattedMessage id="dataCollectionModeOn" />;
      case 'off':
        return <FormattedMessage id="dataCollectionModeOff" />;
      case 'inherited':
        return (
          <>
            <Box>
              <FormattedMessage
                id={item.effectiveDataCollectionMode === 'on' ? 'dataCollectionModeOn' : 'dataCollectionModeOff'}
              />
            </Box>
            <Box sx={{ color: 'text.secondary' }}>
              {'*'}
              <FormattedMessage id="dataCollectionModeInherited" />
              {'*'}
            </Box>
          </>
        );
      default:
        return <></>;
    }
  }, [item.dataCollectionMode, item.effectiveDataCollectionMode]);

  const updateState = useUpdateItem();

  const toggleDataCollectionMode = useCallback(async (): Promise<void> => {
    const newDataCollectionMode = getNewDataCollectionMode(item.dataCollectionMode);
    try {
      await updateState.mutateAsync({ item: { ...item, dataCollectionMode: newDataCollectionMode } });
    } catch (e) {}
  }, [item]);

  const getNewDataCollectionMode = useCallback(
    (dataCollectionMode: InstanceDataCollectionMode): InstanceDataCollectionMode => {
      switch (dataCollectionMode) {
        case 'on':
          return 'off';
        case 'off':
          return 'inherited';
        case 'inherited':
          return 'on';
        default:
          return 'on';
      }
    },
    []
  );

  return (
    <Stack
      direction={'row'}
      alignItems={'center'}
      justifyContent={'space-between'}
      sx={{ height: 60, px: COMPONENTS_SPACING }}
    >
      <Typography
        variant={'body2'}
        sx={{ color: 'text.secondary', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
      >
        <FormattedMessage id={'dataCollection'} />
      </Typography>
      <Tooltip title={tooltip}>
        <Button
          size={'small'}
          variant={'outlined'}
          color={color}
          onClick={toggleDataCollectionMode}
          sx={{ minWidth: 60, px: 0 }}
        >
          {showAsterisk && '*'}
          <FormattedMessage id={textId} />
          {showAsterisk && '*'}
        </Button>
      </Tooltip>
    </Stack>
  );
}
