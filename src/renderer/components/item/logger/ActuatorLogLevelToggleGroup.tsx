import { useCallback, useMemo } from 'react';
import { ToggleButton, ToggleButtonGroup } from '@mui/material';
import { ActuatorLogLevel } from 'infra/actuator/model/loggers';

type ActuatorLogLevelToggleGroupProps = {
  configuredLevel?: ActuatorLogLevel;
  effectiveLevel: ActuatorLogLevel;
  disabled?: boolean;
  onChange?: (newLevel: ActuatorLogLevel) => void;
};

export default function ActuatorLogLevelToggleGroup({
  configuredLevel,
  effectiveLevel,
  disabled,
  onChange,
}: ActuatorLogLevelToggleGroupProps) {
  const changeHandler = useCallback(
    (event: React.MouseEvent<HTMLElement>, newLevel: ActuatorLogLevel) => {
      if (!newLevel) {
        return;
      }
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
    <ToggleButtonGroup value={configuredLevel} size={'small'} disabled={disabled} exclusive onChange={changeHandler}>
      {logLevels.map((level) => {
        const selected = !configuredLevel && effectiveLevel === level ? true : undefined;
        return (
          <ToggleButton
            value={level}
            color={getColor(level)}
            selected={selected}
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
