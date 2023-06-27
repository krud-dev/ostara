import { EntityBaseColumn } from 'renderer/entity/entity';
import React, { useCallback, useState } from 'react';
import { useAnalyticsContext } from '../../../../contexts/AnalyticsContext';
import { Switch } from '@mui/material';
import { useUpdateInstanceTogglzFeature } from '../../../../apis/requests/instance/togglz/updateInstanceTogglzFeature';
import { EnrichedTogglzFeature } from '../../../../apis/requests/instance/togglz/getInstanceTogglz';
import { useUpdateEffect } from 'react-use';

type TableCellDataInstanceTogglzToggleProps<EntityItem extends EnrichedTogglzFeature> = {
  row: EntityItem;
  column: EntityBaseColumn<EntityItem>;
};

export default function TableCellDataInstanceTogglzToggle<EntityItem extends EnrichedTogglzFeature>({
  row,
  column,
}: TableCellDataInstanceTogglzToggleProps<EntityItem>) {
  const { track } = useAnalyticsContext();

  const [enabled, setEnabled] = useState<boolean>(row.enabled);

  useUpdateEffect(() => {
    setEnabled(row.enabled);
  }, [row.enabled]);

  const updateTogglzState = useUpdateInstanceTogglzFeature();

  const changeHandler = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>, newEnabled: boolean): Promise<void> => {
      track({ name: 'togglz_change', properties: { item_type: 'instance', enabled: newEnabled } });

      setEnabled(newEnabled);
      try {
        await updateTogglzState.mutateAsync({
          instanceId: row.instanceId,
          featureName: row.name,
          enabled: newEnabled,
        });
      } catch (e) {
        setEnabled(!newEnabled);
      }
    },
    [row, updateTogglzState]
  );

  const clickHandler = useCallback((event: React.MouseEvent): void => {
    event.stopPropagation();
  }, []);

  return (
    <Switch
      checked={enabled}
      onChange={changeHandler}
      onClick={clickHandler}
      disabled={updateTogglzState.isLoading}
      color={'primary'}
      edge={'start'}
    />
  );
}
