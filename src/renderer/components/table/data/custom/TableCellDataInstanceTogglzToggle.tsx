import { EntityBaseColumn } from 'renderer/entity/entity';
import { useCallback, useMemo, useState } from 'react';
import { useSetInstanceLoggerLevel } from 'renderer/apis/requests/instance/loggers/setInstanceLoggerLevel';
import { useUpdateEffect } from 'react-use';
import { useAnalytics } from '../../../../contexts/AnalyticsContext';
import { TogglzFeatureActuatorResponse } from '../../../../../common/generated_definitions';

type TableCellDataInstanceTogglzToggleProps<EntityItem extends TogglzFeatureActuatorResponse> = {
  row: EntityItem;
  column: EntityBaseColumn<EntityItem>;
};

export default function TableCellDataInstanceTogglzToggle<EntityItem extends TogglzFeatureActuatorResponse>({
  row,
  column,
}: TableCellDataInstanceTogglzToggleProps<EntityItem>) {
  const { track } = useAnalytics();

  const [loadingLevels, setLoadingLevels] = useState<string[] | undefined>(undefined);

  const disabled = useMemo(() => !!loadingLevels, [loadingLevels]);

  const setLevelState = useSetInstanceLoggerLevel();
  const changeHandler = useCallback(
    async (newLevel: string): Promise<void> => {
      if (setLevelState.isLoading) {
        return;
      }

      track({ name: 'log_level_change', properties: { item_type: 'instance', level: newLevel } });

      setLoadingLevels([newLevel]);
      // try {
      //   await setLevelState.mutateAsync({ instanceId: row.instanceId, loggerName: row.name, level: newLevel });
      // } catch (e) {
      //   setLoadingLevels(undefined);
      // }
    },
    [row, setLevelState]
  );

  useUpdateEffect(() => {
    setLoadingLevels(undefined);
  }, [row]);

  return null;
}
