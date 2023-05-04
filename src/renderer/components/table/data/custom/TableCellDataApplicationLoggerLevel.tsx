import { EntityBaseColumn } from 'renderer/entity/entity';
import { useCallback, useMemo, useState } from 'react';
import LogLevelToggleGroup from 'renderer/components/item/logger/LogLevelToggleGroup';
import { EnrichedApplicationLoggerRO } from 'renderer/apis/requests/application/loggers/getApplicationLoggers';
import { useSetApplicationLoggerLevel } from 'renderer/apis/requests/application/loggers/setApplicationLoggerLevel';
import { map } from 'lodash';
import { notEmpty } from 'renderer/utils/objectUtils';
import { LogLevel } from '../../../../../common/generated_definitions';
import { useUpdateEffect } from 'react-use';
import { useAnalytics } from '../../../../contexts/AnalyticsContext';

type TableCellDataApplicationLoggerLevelProps<EntityItem extends EnrichedApplicationLoggerRO> = {
  row: EntityItem;
  column: EntityBaseColumn<EntityItem>;
};

export default function TableCellDataApplicationLoggerLevel<EntityItem extends EnrichedApplicationLoggerRO>({
  row,
  column,
}: TableCellDataApplicationLoggerLevelProps<EntityItem>) {
  const { track } = useAnalytics();

  const [loadingLevels, setLoadingLevels] = useState<LogLevel[] | undefined>(undefined);

  const disabled = useMemo(() => !!loadingLevels, [loadingLevels]);

  const setLevelState = useSetApplicationLoggerLevel();
  const changeHandler = useCallback(
    async (newLevel: LogLevel): Promise<void> => {
      if (setLevelState.isLoading) {
        return;
      }

      track({ name: 'log_level_change', properties: { item_type: 'application', level: newLevel } });

      setLoadingLevels([newLevel]);
      try {
        setLevelState.mutate({ applicationId: row.applicationId, loggerName: row.name, level: newLevel });
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
    () => map(row.loggers, (logger) => logger.effectiveLevel).filter(notEmpty),
    [row.loggers]
  );
  const configuredLevels = useMemo<LogLevel[] | undefined>(
    () => map(row.loggers, (logger) => logger.configuredLevel).filter(notEmpty),
    [row.loggers]
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
