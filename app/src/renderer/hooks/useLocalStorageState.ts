import { Dispatch, SetStateAction, useState } from 'react';
import { isFunction, isNil } from 'lodash';

export const useLocalStorageState = <S>(key: string, initialState: S | (() => S)): [S, Dispatch<SetStateAction<S>>] => {
  const [item, setInnerValue] = useState<S>(() => {
    const valueItemString = localStorage.getItem(key);
    if (!isNil(valueItemString)) {
      return JSON.parse(valueItemString);
    }
    return isFunction(initialState) ? initialState() : initialState;
  });

  const setValue = (value: SetStateAction<S>): void => {
    setInnerValue((currentInnerValue) => {
      const valueToStore = isFunction(value) ? value(currentInnerValue) : value;

      if (!isNil(valueToStore)) {
        localStorage.setItem(key, JSON.stringify(valueToStore));
      } else {
        localStorage.removeItem(key);
      }

      return valueToStore;
    });
  };

  return [item, setValue];
};
