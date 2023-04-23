import { useCallback, useMemo } from 'react';
import { CircularProgress, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { LogLevel } from '../../../../common/generated_definitions';

type LogLevelToggleGroupProps = {
  configuredLevels?: LogLevel[];
  effectiveLevels: LogLevel[];
  loadingLevels?: LogLevel[];
  disabled?: boolean;
  onChange?: (newLevel: LogLevel) => void;
};

export default function LogLevelToggleGroup({
  configuredLevels,
  effectiveLevels,
  loadingLevels,
  disabled,
  onChange,
}: LogLevelToggleGroupProps) {
  const changeHandler = useCallback(
    (newLevel: LogLevel) => {
      onChange?.(newLevel);
    },
    [onChange]
  );

  const logLevels = useMemo<LogLevel[]>(() => ['OFF', 'ERROR', 'WARN', 'INFO', 'DEBUG', 'TRACE'], []);

  const getColor = useCallback((level: LogLevel) => {
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
      default:
        return undefined;
    }
  }, []);

  return (
    <ToggleButtonGroup value={configuredLevels} size={'small'} disabled={disabled}>
      {logLevels.map((level) => {
        const selected = !configuredLevels?.includes(level) && effectiveLevels.includes(level) ? true : undefined;
        const loading = !!loadingLevels?.includes(level);
        const color = getColor(level);
        return (
          <ToggleButton
            value={level}
            color={color}
            selected={selected}
            onClick={() => changeHandler(level)}
            sx={{ whiteSpace: 'nowrap', ...(selected ? { opacity: 0.5 } : {}) }}
            key={level}
          >
            {level}
            {loading && <CircularProgress size={24} color={color} sx={{ position: 'absolute' }} />}
          </ToggleButton>
        );
      })}
    </ToggleButtonGroup>
  );
}
