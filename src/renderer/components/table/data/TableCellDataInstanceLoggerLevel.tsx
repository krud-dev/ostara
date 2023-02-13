import { EntityBaseColumn } from 'renderer/entity/entity';
import { useCallback, useMemo } from 'react';
import LogLevelToggleGroup from 'renderer/components/item/logger/LogLevelToggleGroup';
import { useSetInstanceLoggerLevel } from 'renderer/apis/instance/setInstanceLoggerLevel';
import { EnrichedInstanceLoggerRO } from 'renderer/apis/instance/getInstanceLoggers';
import { LogLevel } from '../../../../common/generated_definitions';

type TableCellDataLoggerLevelProps<EntityItem extends EnrichedInstanceLoggerRO> = {
  row: EntityItem;
  column: EntityBaseColumn<EntityItem>;
};

export default function TableCellDataInstanceLoggerLevel<EntityItem extends EnrichedInstanceLoggerRO>({
  row,
  column,
}: TableCellDataLoggerLevelProps<EntityItem>) {
  const setLevelState = useSetInstanceLoggerLevel();

  const changeHandler = useCallback(
    (newLevel: LogLevel | undefined) => {
      if (setLevelState.isLoading) {
        return;
      }
      setLevelState.mutate({ instanceId: row.instanceId, loggerName: row.name, level: newLevel });
    },
    [row, setLevelState]
  );

  const effectiveLevels = useMemo<LogLevel[]>(
    () => (row.effectiveLevel ? [row.effectiveLevel] : []),
    [row.effectiveLevel]
  );
  const configuredLevels = useMemo<LogLevel[] | undefined>(
    () => (row.configuredLevel ? [row.configuredLevel] : undefined),
    [row.configuredLevel]
  );

  return (
    <LogLevelToggleGroup
      effectiveLevels={effectiveLevels}
      configuredLevels={configuredLevels}
      onChange={changeHandler}
    />
  );
}
