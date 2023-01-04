import React, { useCallback } from 'react';
import {
  DataCollectionMode,
  EnrichedApplication,
  EnrichedInstance,
  InstanceDataCollectionMode,
} from 'infra/configuration/model/configuration';
import { useUpdateItem } from 'renderer/apis/configuration/item/updateItem';
import DataCollectionToggle from 'renderer/components/item/data-collection/DataCollectionToggle';

type ApplicationDataCollectionToggleProps = { item: EnrichedApplication };

export default function ApplicationDataCollectionToggle({ item }: ApplicationDataCollectionToggleProps) {
  const updateState = useUpdateItem();

  const toggleHandler = useCallback(async (): Promise<void> => {
    const newDataCollectionMode = getNewDataCollectionMode(item.dataCollectionMode);
    try {
      await updateState.mutateAsync({ item: { ...item, dataCollectionMode: newDataCollectionMode } });
    } catch (e) {}
  }, [item]);

  const getNewDataCollectionMode = useCallback((dataCollectionMode: DataCollectionMode): DataCollectionMode => {
    switch (dataCollectionMode) {
      case 'on':
        return 'off';
      case 'off':
        return 'on';
      default:
        return 'on';
    }
  }, []);

  return (
    <DataCollectionToggle
      dataCollectionMode={item.dataCollectionMode}
      effectiveDataCollectionMode={item.dataCollectionMode}
      onToggle={toggleHandler}
    />
  );
}
