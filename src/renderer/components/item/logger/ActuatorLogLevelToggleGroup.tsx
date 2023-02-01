import { useCallback, useMemo } from 'react';
import { ToggleButton, ToggleButtonGroup } from '@mui/material';
import { ActuatorLogLevel } from 'infra/actuator/model/loggers';

type ActuatorLogLevelToggleGroupProps = {
  configuredLevels?: ActuatorLogLevel[];
  effectiveLevels: ActuatorLogLevel[];
  disabled?: boolean;
  onChange?: (newLevel: ActuatorLogLevel) => void;
};

export default function ActuatorLogLevelToggleGroup({
  configuredLevels,
  effectiveLevels,
  disabled,
  onChange,
}: ActuatorLogLevelToggleGroupProps) {
  const changeHandler = useCallback(
    (newLevel: ActuatorLogLevel) => {
      onChange?.(newLevel);
    },
    [onChange]
  );

  const logLevels = useMemo<ActuatorLogLevel[]>(() => ['OFF', 'ERROR', 'WARN', 'INFO', 'DEBUG', 'TRACE'], []);

  const getColor = useCallback((level: ActuatorLogLevel) => {
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
