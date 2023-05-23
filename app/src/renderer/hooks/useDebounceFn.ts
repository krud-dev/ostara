import { useCallback } from 'react';
import { debounce } from 'lodash';
import { useUnmount } from 'react-use';

const useDebounceFn = (fn: any, wait: number) => {
  const fnDebounced = useCallback(debounce(fn, wait), [fn, wait]);

  useUnmount(() => {
    fnDebounced.cancel();
  });

  return fnDebounced;
};

export default useDebounceFn;
