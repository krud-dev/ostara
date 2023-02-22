import { EntityBaseColumn } from 'renderer/entity/entity';
import { useCallback, useMemo, useState } from 'react';
import LogLevelToggleGroup from 'renderer/components/item/logger/LogLevelToggleGroup';
import { EnrichedApplicationLoggerRO } from 'renderer/apis/requests/application/getApplicationLoggers';
import { useSetApplicationLoggerLevel } from 'renderer/apis/requests/application/setApplicationLoggerLevel';
import { map } from 'lodash';
import { notEmpty } from 'renderer/utils/objectUtils';
import { LogLevel } from '../../../../common/generated_definitions';
import { useUpdateEffect } from 'react-use';

type TableCellDataApplicationLoggerLevelProps<EntityItem extends EnrichedApplicationLoggerRO> = {
  row: EntityItem;
  column: EntityBaseColumn<EntityItem>;
};

export default function TableCellDataApplicationLoggerLevel<EntityItem extends EnrichedApplicationLoggerRO>({
  row,
  column,
}: TableCellDataApplicationLoggerLevelProps<EntityItem>) {
  const [disabled, setDisabled] = useState<boolean>(false);

  const setLevelState = useSetApplicationLoggerLevel();
  const changeHandler = useCallback(
    async (newLevel: LogLevel | undefined): Promise<void> => {
      if (setLevelState.isLoading) {
        return;
      }

      setDisabled(true);
      try {
        setLevelState.mutate({ applicationId: row.applicationId, loggerName: row.name, level: newLevel });
      } catch (e) {
        setDisabled(false);
      }
    },
    [row, setLevelState]
  );

  useUpdateEffect(() => {
    setDisabled(false);
  }, [row.loggers]);

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
      disabled={disabled}
      onChange={changeHandler}
    />
  );
}
