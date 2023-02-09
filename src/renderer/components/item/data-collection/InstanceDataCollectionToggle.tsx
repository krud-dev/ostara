import React, { useCallback } from 'react';
import { InstanceDataCollectionMode } from 'infra/configuration/model/configuration';
import { useUpdateItem } from 'renderer/apis/item/updateItem';
import DataCollectionToggle from 'renderer/components/item/data-collection/DataCollectionToggle';
import { InstanceRO } from '../../../../common/generated_definitions';

type InstanceDataCollectionToggleProps = { item: InstanceRO };

export default function InstanceDataCollectionToggle({ item }: InstanceDataCollectionToggleProps) {
  const updateState = useUpdateItem();

  const toggleHandler = useCallback(async (): Promise<void> => {
    // const newDataCollectionMode = getNewDataCollectionMode(item.dataCollectionMode);
    // try {
    //   await updateState.mutateAsync({ item: { ...item, dataCollectionMode: newDataCollectionMode } });
    // } catch (e) {}
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
      // dataCollectionMode={item.dataCollectionMode}
      dataCollectionMode={'on'}
      // effectiveDataCollectionMode={item.effectiveDataCollectionMode}
      effectiveDataCollectionMode={'on'}
      onToggle={toggleHandler}
    />
  );
}
