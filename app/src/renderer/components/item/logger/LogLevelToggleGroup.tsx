import { useCallback, useMemo } from 'react';
import { Box, CircularProgress, ToggleButton, ToggleButtonGroup, Tooltip } from '@mui/material';
import NiceModal from '@ebay/nice-modal-react';
import CustomLogLevelDialog, { CustomLogLevelDialogProps } from './CustomLogLevelDialog';

type LogLevelToggleGroupProps = {
  configuredLevels?: string[];
  effectiveLevels: string[];
  loadingLevels?: string[];
  disabled?: boolean;
  onChange?: (newLevel: string) => void;
};

export default function LogLevelToggleGroup({
  configuredLevels,
  effectiveLevels,
  loadingLevels,
  disabled,
  onChange,
}: LogLevelToggleGroupProps) {
  const customLogLevel = useMemo<string>(() => 'CUSTOM', []);
  const logLevels = useMemo<string[]>(
    () => ['OFF', 'ERROR', 'WARN', 'INFO', 'DEBUG', 'TRACE', customLogLevel],
    [customLogLevel]
  );
  const customLogLevelValue = useMemo<string>(() => {
    const customConfiguredLevel = configuredLevels?.find((level) => !logLevels?.includes(level));
    if (customConfiguredLevel) {
      return customConfiguredLevel;
    }
    const customEffectiveLevel = effectiveLevels.find((level) => !logLevels?.includes(level));
    if (customEffectiveLevel) {
      return customEffectiveLevel;
    }
    return '';
  }, [configuredLevels, effectiveLevels, logLevels]);
  const value = useMemo<string[] | undefined>(
    () => configuredLevels?.map((level) => (logLevels.includes(level) ? level : customLogLevel)),
    [configuredLevels]
  );

  const changeHandler = useCallback(
    async (newLevel: string): Promise<void> => {
      let levelToChange = newLevel;

      if (newLevel === customLogLevel) {
        const newCustomLevel = await NiceModal.show<string | undefined, CustomLogLevelDialogProps>(
          CustomLogLevelDialog,
          {}
        );
        if (!newCustomLevel) {
          return;
        }
        levelToChange = newCustomLevel;
      }

      onChange?.(levelToChange);
    },
    [customLogLevel, onChange]
  );

  const getColor = useCallback((level: string) => {
    switch (level) {
      case 'OFF':
        return undefined;
      case 'ERROR':
        return 'error';
      case 'WARN':
        return 'warning';
      case 'INFO':
        return 'success';
      case 'DEBUG':
        return 'info';
      case 'TRACE':
        return 'fatal';
      case 'CUSTOM':
        return undefined;
      default:
        return undefined;
    }
  }, []);

  return (
    <ToggleButtonGroup value={value} size={'small'} disabled={disabled}>
      {logLevels.map((level) => {
        const levelValue = level === customLogLevel ? customLogLevelValue : level;
        const selected =
          !configuredLevels?.includes(levelValue) && effectiveLevels.includes(levelValue) ? true : undefined;
        const loading = !!loadingLevels?.includes(levelValue);
        const color = getColor(level);
        const tooltip = level === customLogLevel ? customLogLevelValue : '';
        return (
          <ToggleButton
            value={level}
            color={color}
            selected={selected}
            onClick={() => changeHandler(level)}
            sx={{ whiteSpace: 'nowrap', ...(selected ? { opacity: 0.5 } : {}) }}
            key={level}
          >
            <Tooltip title={tooltip} key={level}>
              <Box component={'span'}>{level}</Box>
            </Tooltip>
            {loading && <CircularProgress size={24} color={color} sx={{ position: 'absolute' }} />}
          </ToggleButton>
        );
      })}
    </ToggleButtonGroup>
  );
}
