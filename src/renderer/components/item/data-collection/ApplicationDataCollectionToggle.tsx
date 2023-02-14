import React, { useCallback } from 'react';
import { useUpdateItem } from 'renderer/apis/item/updateItem';
import DataCollectionToggle from 'renderer/components/item/data-collection/DataCollectionToggle';
import { ApplicationRO } from '../../../../common/generated_definitions';

type ApplicationDataCollectionToggleProps = { item: ApplicationRO };

export default function ApplicationDataCollectionToggle({ item }: ApplicationDataCollectionToggleProps) {
  const updateState = useUpdateItem();

  const toggleHandler = useCallback(async (): Promise<void> => {
    // const newDataCollectionMode = getNewDataCollectionMode(item.dataCollectionMode);
    // try {
    //   await updateState.mutateAsync({ item: { ...item, dataCollectionMode: newDataCollectionMode } });
    // } catch (e) {}
  }, [item]);

  // const getNewDataCollectionMode = useCallback((dataCollectionMode: DataCollectionMode): DataCollectionMode => {
  //   switch (dataCollectionMode) {
  //     case 'on':
  //       return 'off';
  //     case 'off':
  //       return 'on';
  //     default:
  //       return 'on';
  //   }
  // }, []);

  return (
    <DataCollectionToggle
      // dataCollectionMode={item.dataCollectionMode}
      // dataCollectionMode={'on'}
      // effectiveDataCollectionMode={item.dataCollectionMode}
      // effectiveDataCollectionMode={'on'}
      onToggle={toggleHandler}
    />
  );
}
