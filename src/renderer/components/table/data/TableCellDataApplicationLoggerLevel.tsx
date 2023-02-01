import { EntityBaseColumn } from 'renderer/entity/entity';
import { useCallback, useMemo } from 'react';
import { ActuatorLogLevel } from 'infra/actuator/model/loggers';
import ActuatorLogLevelToggleGroup from 'renderer/components/item/logger/ActuatorLogLevelToggleGroup';
import { EnrichedApplicationLogger } from 'renderer/apis/application/getApplicationLoggers';
import { useSetApplicationLoggerLevel } from 'renderer/apis/application/setApplicationLoggerLevel';
import { map } from 'lodash';
import { notEmpty } from 'renderer/utils/objectUtils';

type TableCellDataApplicationLoggerLevelProps<EntityItem extends EnrichedApplicationLogger> = {
  row: EntityItem;
  column: EntityBaseColumn<EntityItem>;
};

export default function TableCellDataApplicationLoggerLevel<EntityItem extends EnrichedApplicationLogger>({
  row,
  column,
}: TableCellDataApplicationLoggerLevelProps<EntityItem>) {
  const setLevelState = useSetApplicationLoggerLevel();

  const changeHandler = useCallback(
    (newLevel: ActuatorLogLevel | undefined) => {
      if (setLevelState.isLoading) {
        return;
      }
      setLevelState.mutate({ applicationId: row.applicationId, loggerName: row.name, level: newLevel });
    },
    [row, setLevelState]
  );

  const effectiveLevels = useMemo<ActuatorLogLevel[]>(
    () => map(row.instanceLoggers, (logger) => logger.effectiveLevel),
    [row.instanceLoggers]
  );
  const configuredLevels = useMemo<ActuatorLogLevel[] | undefined>(
    () => map(row.instanceLoggers, (logger) => logger.configuredLevel).filter(notEmpty),
    [row.instanceLoggers]
  );

  return (
    <ActuatorLogLevelToggleGroup
      effectiveLevels={effectiveLevels}
      configuredLevels={configuredLevels}
      onChange={changeHandler}
    />
  );
}
