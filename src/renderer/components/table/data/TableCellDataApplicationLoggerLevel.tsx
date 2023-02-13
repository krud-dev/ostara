import { EntityBaseColumn } from 'renderer/entity/entity';
import { useCallback, useMemo } from 'react';
import LogLevelToggleGroup from 'renderer/components/item/logger/LogLevelToggleGroup';
import { EnrichedApplicationLoggerRO } from 'renderer/apis/application/getApplicationLoggers';
import { useSetApplicationLoggerLevel } from 'renderer/apis/application/setApplicationLoggerLevel';
import { map } from 'lodash';
import { notEmpty } from 'renderer/utils/objectUtils';
import { LogLevel } from '../../../../common/generated_definitions';

type TableCellDataApplicationLoggerLevelProps<EntityItem extends EnrichedApplicationLoggerRO> = {
  row: EntityItem;
  column: EntityBaseColumn<EntityItem>;
};

export default function TableCellDataApplicationLoggerLevel<EntityItem extends EnrichedApplicationLoggerRO>({
  row,
  column,
}: TableCellDataApplicationLoggerLevelProps<EntityItem>) {
  const setLevelState = useSetApplicationLoggerLevel();

  const changeHandler = useCallback(
    (newLevel: LogLevel | undefined) => {
      if (setLevelState.isLoading) {
        return;
      }
      setLevelState.mutate({ applicationId: row.applicationId, loggerName: row.name, level: newLevel });
    },
    [row, setLevelState]
  );

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
      onChange={changeHandler}
    />
  );
}
