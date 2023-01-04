import React, { useCallback } from 'react';
import { EnrichedInstance, InstanceDataCollectionMode } from 'infra/configuration/model/configuration';
import { useUpdateItem } from 'renderer/apis/configuration/item/updateItem';
import DataCollectionToggle from 'renderer/components/item/data-collection/DataCollectionToggle';

type InstanceDataCollectionToggleProps = { item: EnrichedInstance };

export default function InstanceDataCollectionToggle({ item }: InstanceDataCollectionToggleProps) {
  const updateState = useUpdateItem();

  const toggleHandler = useCallback(async (): Promise<void> => {
    const newDataCollectionMode = getNewDataCollectionMode(item.dataCollectionMode);
    try {
      await updateState.mutateAsync({ item: { ...item, dataCollectionMode: newDataCollectionMode } });
    } catch (e) {}
  }, [item]);

  const getNewDataCollectionMode = useCallback(
    (dataCollectionMode: InstanceDataCollectionMode): InstanceDataCollectionMode => {
      switch (dataCollectionMode) {
        case 'on':
          return 'off';
        case 'off':
          return 'inherited';
        case 'inherited':
          return 'on';
        default:
          return 'on';
      }
    },
    []
  );

  return (
    <DataCollectionToggle
      dataCollectionMode={item.dataCollectionMode}
      effectiveDataCollectionMode={item.effectiveDataCollectionMode}
      onToggle={toggleHandler}
    />
  );
}
