import { EntityBaseColumn } from 'renderer/entity/entity';
import { useCallback, useMemo, useState } from 'react';
import LogLevelToggleGroup from 'renderer/components/item/logger/LogLevelToggleGroup';
import { useSetInstanceLoggerLevel } from 'renderer/apis/requests/instance/loggers/setInstanceLoggerLevel';
import { EnrichedInstanceLoggerRO } from 'renderer/apis/requests/instance/loggers/getInstanceLoggers';
import { LogLevel } from '../../../../common/generated_definitions';
import { useUpdateEffect } from 'react-use';

type TableCellDataLoggerLevelProps<EntityItem extends EnrichedInstanceLoggerRO> = {
  row: EntityItem;
  column: EntityBaseColumn<EntityItem>;
};

export default function TableCellDataInstanceLoggerLevel<EntityItem extends EnrichedInstanceLoggerRO>({
  row,
  column,
}: TableCellDataLoggerLevelProps<EntityItem>) {
  const [disabled, setDisabled] = useState<boolean>(false);

  const setLevelState = useSetInstanceLoggerLevel();
  const changeHandler = useCallback(
    async (newLevel: LogLevel | undefined): Promise<void> => {
      if (setLevelState.isLoading) {
        return;
      }

      setDisabled(true);
      try {
        await setLevelState.mutateAsync({ instanceId: row.instanceId, loggerName: row.name, level: newLevel });
      } catch (e) {
        setDisabled(false);
      }
    },
    [row, setLevelState]
  );

  useUpdateEffect(() => {
    setDisabled(false);
  }, [row.effectiveLevel, row.configuredLevel]);

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
      disabled={disabled}
      onChange={changeHandler}
    />
  );
}
