import { EntityBaseColumn } from 'renderer/entity/entity';
import { useCallback, useMemo } from 'react';
import { ActuatorLogLevel } from 'infra/actuator/model/loggers';
import ActuatorLogLevelToggleGroup from 'renderer/components/item/logger/ActuatorLogLevelToggleGroup';
import { useSetInstanceLoggerLevel } from 'renderer/apis/instance/setInstanceLoggerLevel';
import { EnrichedInstanceLogger } from 'renderer/apis/instance/getInstanceLoggers';

type TableCellDataLoggerLevelProps<EntityItem extends EnrichedInstanceLogger> = {
  row: EntityItem;
  column: EntityBaseColumn<EntityItem>;
};

export default function TableCellDataInstanceLoggerLevel<EntityItem extends EnrichedInstanceLogger>({
  row,
  column,
}: TableCellDataLoggerLevelProps<EntityItem>) {
  const setLevelState = useSetInstanceLoggerLevel();

  const changeHandler = useCallback(
    (newLevel: ActuatorLogLevel | undefined) => {
      if (setLevelState.isLoading) {
        return;
      }
      setLevelState.mutate({ instanceId: row.instanceId, loggerName: row.name, level: newLevel });
    },
    [row, setLevelState]
  );

  const effectiveLevels = useMemo<ActuatorLogLevel[]>(() => [row.effectiveLevel], [row.effectiveLevel]);
  const configuredLevels = useMemo<ActuatorLogLevel[] | undefined>(
    () => (row.configuredLevel ? [row.configuredLevel] : undefined),
    [row.configuredLevel]
  );

  return (
    <ActuatorLogLevelToggleGroup
      effectiveLevels={effectiveLevels}
      configuredLevels={configuredLevels}
      onChange={changeHandler}
    />
  );
}
