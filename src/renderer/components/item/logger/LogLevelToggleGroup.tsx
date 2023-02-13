import { useCallback, useMemo } from 'react';
import { ToggleButton, ToggleButtonGroup } from '@mui/material';
import { LogLevel } from '../../../../common/generated_definitions';

type LogLevelToggleGroupProps = {
  configuredLevels?: LogLevel[];
  effectiveLevels: LogLevel[];
  disabled?: boolean;
  onChange?: (newLevel: LogLevel) => void;
};

export default function LogLevelToggleGroup({
  configuredLevels,
  effectiveLevels,
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
        return (
          <ToggleButton
            value={level}
            color={getColor(level)}
            selected={selected}
            onClick={() => changeHandler(level)}
            sx={{ whiteSpace: 'nowrap', ...(selected ? { opacity: 0.5 } : {}) }}
            key={level}
          >
            {level}
          </ToggleButton>
        );
      })}
    </ToggleButtonGroup>
  );
}
