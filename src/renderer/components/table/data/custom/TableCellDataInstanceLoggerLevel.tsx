import { EntityBaseColumn } from 'renderer/entity/entity';
import { useCallback, useMemo, useState } from 'react';
import LogLevelToggleGroup from 'renderer/components/item/logger/LogLevelToggleGroup';
import { useSetInstanceLoggerLevel } from 'renderer/apis/requests/instance/loggers/setInstanceLoggerLevel';
import { EnrichedInstanceLoggerRO } from 'renderer/apis/requests/instance/loggers/getInstanceLoggers';
import { LogLevel } from '../../../../../common/generated_definitions';
import { useUpdateEffect } from 'react-use';
import { useAnalytics } from '../../../../contexts/AnalyticsContext';

type TableCellDataLoggerLevelProps<EntityItem extends EnrichedInstanceLoggerRO> = {
  row: EntityItem;
  column: EntityBaseColumn<EntityItem>;
};

export default function TableCellDataInstanceLoggerLevel<EntityItem extends EnrichedInstanceLoggerRO>({
  row,
  column,
}: TableCellDataLoggerLevelProps<EntityItem>) {
  const { track } = useAnalytics();

  const [loadingLevels, setLoadingLevels] = useState<LogLevel[] | undefined>(undefined);

  const disabled = useMemo(() => !!loadingLevels, [loadingLevels]);

  const setLevelState = useSetInstanceLoggerLevel();
  const changeHandler = useCallback(
    async (newLevel: LogLevel): Promise<void> => {
      if (setLevelState.isLoading) {
        return;
      }

      track({ name: 'log_level_change', properties: { item_type: 'instance', level: newLevel } });

      setLoadingLevels([newLevel]);
      try {
        await setLevelState.mutateAsync({ instanceId: row.instanceId, loggerName: row.name, level: newLevel });
      } catch (e) {
        setLoadingLevels(undefined);
      }
    },
    [row, setLevelState]
  );

  useUpdateEffect(() => {
    setLoadingLevels(undefined);
  }, [row]);

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
      loadingLevels={loadingLevels}
      disabled={disabled}
      onChange={changeHandler}
    />
  );
}
