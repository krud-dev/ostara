import { EntityBaseColumn } from 'renderer/entity/entity';
import React, { useCallback, useState } from 'react';
import { useAnalytics } from '../../../../contexts/AnalyticsContext';
import { Switch } from '@mui/material';
import { useUpdateInstanceTogglzFeature } from '../../../../apis/requests/instance/togglz/updateInstanceTogglzFeature';
import { EnrichedTogglzFeature } from '../../../../apis/requests/instance/togglz/getInstanceTogglz';

type TableCellDataInstanceTogglzToggleProps<EntityItem extends EnrichedTogglzFeature> = {
  row: EntityItem;
  column: EntityBaseColumn<EntityItem>;
};

export default function TableCellDataInstanceTogglzToggle<EntityItem extends EnrichedTogglzFeature>({
  row,
  column,
}: TableCellDataInstanceTogglzToggleProps<EntityItem>) {
  const { track } = useAnalytics();

  const [enabled, setEnabled] = useState<boolean>(row.enabled);

  const updateTogglzState = useUpdateInstanceTogglzFeature({ refetchNone: true });

  const changeHandler = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>, newEnabled: boolean): Promise<void> => {
      track({ name: 'togglz_change', properties: { item_type: 'instance', enabled: newEnabled } });

      setEnabled(newEnabled);
      try {
        await updateTogglzState.mutateAsync({
          instanceId: row.instanceId,
          featureName: row.name,
          enabled: row.enabled,
        });
      } catch (e) {
        setEnabled(!newEnabled);
      }
    },
    [row, updateTogglzState]
  );

  return (
    <Switch
      checked={enabled}
      onChange={changeHandler}
      disabled={updateTogglzState.isLoading}
      color={'primary'}
      edge={'start'}
    />
  );
}
