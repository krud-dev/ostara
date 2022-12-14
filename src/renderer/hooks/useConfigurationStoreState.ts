import { Dispatch, SetStateAction, useState } from 'react';
import { isFunction, isNil } from 'lodash';

const useConfigurationStoreState = <S>(
  key: string,
  initialState: S | (() => S)
): [S, Dispatch<SetStateAction<S>>] => {
  const [item, setInnerValue] = useState<S>((): S => {
    const valueItem = window.electron.configurationStore.get(key);
    if (!isNil(valueItem)) {
      return valueItem as S;
    }
    return isFunction(initialState) ? initialState() : initialState;
  });

  const setValue = (value: SetStateAction<S>): void => {
    setInnerValue((currentInnerValue) => {
      const valueToStore = isFunction(value) ? value(currentInnerValue) : value;

      if (!isNil(valueToStore)) {
        window.electron.configurationStore.set(key, valueToStore);
      } else {
        window.electron.configurationStore.delete(key);
      }

      return valueToStore;
    });
  };

  return [item, setValue];
};
export default useConfigurationStoreState;
