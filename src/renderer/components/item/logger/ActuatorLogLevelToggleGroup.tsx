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

  const logLevels = useMemo<ActuatorLogLevel[]>(() => ['OFF', 'ERROR', 'WARN', 'INFO', 'DEBUG', 'TRACE', 'ALL'], []);

  const getColor = useCallback((level: ActuatorLogLevel) => {
    switch (level) {
      case 'OFF':
        return undefined;
      case 'ERROR':
        return 'success';
      case 'WARN':
        return 'success';
      case 'INFO':
        return 'info';
      case 'DEBUG':
        return 'warning';
      case 'TRACE':
        return 'error';
      case 'ALL':
        return 'error';
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
