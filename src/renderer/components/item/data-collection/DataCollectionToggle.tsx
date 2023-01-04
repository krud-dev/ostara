import React, { ReactNode, useMemo } from 'react';
import { DataCollectionMode, InstanceDataCollectionMode } from 'infra/configuration/model/configuration';
import { Box, Button, Stack, Tooltip, Typography } from '@mui/material';
import { FormattedMessage } from 'react-intl';
import { getDataCollectionModeColor, getDataCollectionModeTextId } from 'renderer/utils/itemUtils';
import { ColorSchema } from 'renderer/theme/config/palette';
import { COMPONENTS_SPACING } from 'renderer/constants/ui';

type DataCollectionToggleProps = {
  dataCollectionMode: InstanceDataCollectionMode;
  effectiveDataCollectionMode: DataCollectionMode;
  onToggle: () => void;
};

export default function DataCollectionToggle({
  dataCollectionMode,
  effectiveDataCollectionMode,
  onToggle,
}: DataCollectionToggleProps) {
  const color = useMemo<ColorSchema>(
    () => getDataCollectionModeColor(effectiveDataCollectionMode),
    [effectiveDataCollectionMode]
  );
  const textId = useMemo<string>(() => getDataCollectionModeTextId(effectiveDataCollectionMode), [dataCollectionMode]);
  const showAsterisk = useMemo<boolean>(
    () => dataCollectionMode !== effectiveDataCollectionMode,
    [dataCollectionMode, effectiveDataCollectionMode]
  );
  const tooltip = useMemo<ReactNode>(() => {
    switch (dataCollectionMode) {
      case 'on':
        return <FormattedMessage id="dataCollectionModeOn" />;
      case 'off':
        return <FormattedMessage id="dataCollectionModeOff" />;
      case 'inherited':
        return (
          <>
            <Box>
              <FormattedMessage
                id={effectiveDataCollectionMode === 'on' ? 'dataCollectionModeOn' : 'dataCollectionModeOff'}
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
  }, [dataCollectionMode, effectiveDataCollectionMode]);

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
        <Button size={'small'} variant={'outlined'} color={color} onClick={onToggle} sx={{ minWidth: 60, px: 0 }}>
          {showAsterisk && '*'}
          <FormattedMessage id={textId} />
          {showAsterisk && '*'}
        </Button>
      </Tooltip>
    </Stack>
  );
}
