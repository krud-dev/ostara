import { useCallback, useState } from 'react';

const useRerenderKey = (): [string, () => void] => {
  const [rerenderKey, setRerenderKey] = useState<string>('true');

  const rerenderHandler = useCallback((): void => {
    setRerenderKey((prev) => (prev !== 'true').toString());
  }, [setRerenderKey]);

  return [rerenderKey, rerenderHandler];
};

export default useRerenderKey;
