import { Dispatch, SetStateAction, useState } from 'react';
import { isFunction, isNil } from 'lodash';
import { Configuration } from '../../infra/configuration/model/Configuration';

const useConfigurationStoreState = <Key extends keyof Configuration>(
  key: Key,
  initialState: Configuration[Key] | (() => Configuration[Key])
): [Configuration[Key], Dispatch<SetStateAction<Configuration[Key]>>] => {
  const [item, setInnerValue] = useState<Configuration[Key]>((): Configuration[Key] => {
    const valueItem = window.configurationStore.get(key);
    if (!isNil(valueItem)) {
      return valueItem as Configuration[Key];
    }
    return isFunction(initialState) ? initialState() : initialState;
  });

  const setValue = (value: SetStateAction<Configuration[Key]>): void => {
    setInnerValue((currentInnerValue) => {
      const valueToStore = isFunction(value) ? value(currentInnerValue) : value;

      if (!isNil(valueToStore)) {
        window.configurationStore.set(key, valueToStore);
      } else {
        window.configurationStore.delete(key);
      }

      return valueToStore;
    });
  };

  return [item, setValue];
};
export default useConfigurationStoreState;
