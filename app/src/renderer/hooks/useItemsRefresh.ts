import { useCallback, useEffect, useState } from 'react';
import { InstanceRO } from 'common/generated_definitions';
import { difference, isEmpty } from 'lodash';
import { crudSearch } from 'renderer/apis/requests/crud/crudSearch';
import { ItemRO, ItemType } from 'renderer/definitions/daemon';
import { getItemTypeEntity } from 'renderer/utils/itemUtils';

const useItemsRefresh = (itemType: ItemType, updateItems: (items: ItemRO[]) => void): ((itemId: string) => void) => {
  const [itemIdsToRefresh, setItemIdsToRefresh] = useState<string[]>([]);

  const addItemToRefresh = useCallback(
    (itemId: string) => {
      setItemIdsToRefresh((prev) => [...prev.filter((id) => id !== itemId), itemId]);
    },
    [setItemIdsToRefresh]
  );

  useEffect(() => {
    if (isEmpty(itemIdsToRefresh)) {
      return;
    }

    const itemIds = [...itemIdsToRefresh];
    setItemIdsToRefresh((prev) => difference(prev, itemIds));

    (async () => {
      try {
        const result = await crudSearch<InstanceRO>({
          entity: getItemTypeEntity(itemType),
          filterFields: [{ fieldName: 'id', operation: 'In', values: itemIds }],
        });
        updateItems(result.results);
      } catch (e) {}
    })();
  }, [itemIdsToRefresh]);

  return addItemToRefresh;
};
export default useItemsRefresh;
