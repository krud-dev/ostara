import { EntityBaseColumn } from 'renderer/entity/entity';
import { useCallback, useState } from 'react';
import { ToggleButton, ToggleButtonGroup } from '@mui/material';
import { InstanceLogger } from 'infra/instance/models/logger';
import { ActuatorLogLevel } from 'infra/actuator/model/loggers';
import ActuatorLogLevelToggleGroup from 'renderer/components/item/logger/ActuatorLogLevelToggleGroup';
import { useSetInstanceLoggerLevel } from 'renderer/apis/instance/setInstanceLoggerLevel';
import { useUpdateEffect } from 'react-use';
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

  return (
    <ActuatorLogLevelToggleGroup
      effectiveLevel={row.effectiveLevel}
      configuredLevel={row.configuredLevel}
      onChange={changeHandler}
    />
  );
}
