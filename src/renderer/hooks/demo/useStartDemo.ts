import { useCallback, useMemo, useState } from 'react';
import { useCreateDemo } from '../../apis/requests/demo/createDemo';
import { useCrudSearch } from '../../apis/requests/crud/crudSearch';
import { InstanceRO } from '../../../common/generated_definitions';
import { instanceCrudEntity } from '../../apis/requests/crud/entity/entities/instance.crudEntity';
import { getItemUrl } from '../../utils/itemUtils';
import { useNavigate } from 'react-router-dom';
import { useNavigatorTree } from '../../contexts/NavigatorTreeContext';

type StartDemoResult = {
  startDemo: () => Promise<void>;
  loading: boolean;
};

const useStartDemo = (): StartDemoResult => {
  const { addItem } = useNavigatorTree();
  const navigate = useNavigate();

  const [loading, setLoading] = useState<boolean>(false);

  const createDemoState = useCreateDemo();
  const searchInstanceState = useCrudSearch<InstanceRO>({ cacheTime: 0 });

  const startDemo = useCallback(async (): Promise<void> => {
    setLoading(true);

    try {
      const demoAddress = window.demo.getDemoAddress();
      await createDemoState.mutateAsync({ actuatorUrl: demoAddress });

      await window.demo.startDemo();
    } catch (error) {}

    try {
      const demoInstancesResult = await searchInstanceState.mutateAsync({
        entity: instanceCrudEntity,
        filterFields: [{ fieldName: 'demo', operation: 'Equal', values: [true] }],
      });
      const demoInstance = demoInstancesResult.results[0];
      if (demoInstance) {
        addItem(demoInstance);
        navigate(getItemUrl(demoInstance));
      }
    } catch (e) {}

    setLoading(false);
  }, [setLoading, createDemoState, searchInstanceState, addItem, navigate]);

  return useMemo<StartDemoResult>(() => ({ startDemo, loading }), [startDemo, loading]);
};
export default useStartDemo;
