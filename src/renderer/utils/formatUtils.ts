import { isArray, isNil, isNumber, toString } from 'lodash';
import { IntlShape } from 'react-intl';
import { WidgetValueType } from '../components/widget/widget';

export const roundNumber = (number: number, decimals: number): number => {
  return parseFloat(number.toFixed(decimals));
};

export const padValue = (value: number): string => (value < 10 ? `0${value}` : `${value}`);

export const formatWidgetValue = (value: unknown, valueType: WidgetValueType, intl: IntlShape): string => {
  if (isNil(value)) {
    return '\u00A0';
  }
  switch (valueType) {
    case 'number':
      return isNumber(value) ? roundNumber(value, 2).toString() : toString(value);
    case 'array':
      return isArray(value) ? value.join(', ') : toString(value);
    case 'bytes': {
      if (!isNumber(value)) {
        return toString(value);
      }
      if (value >= 1024 * 1024 * 1024) {
        return `${roundNumber(value / 1024 / 1024 / 1024, 2)} GB`;
      }
      return `${roundNumber(value / 1024 / 1024, 2)} MB`;
    }
    case 'seconds': {
      if (!isNumber(value)) {
        return toString(value);
      }

      const d = Math.floor(value / 86400);
      const h = padValue(Math.floor((value % 86400) / 3600));
      const m = padValue(Math.floor((value % 3600) / 60));
      const s = padValue(Math.floor(value % 60));

      return `${d}${intl.formatMessage({ id: 'daysShort' })} ${h}${intl.formatMessage({
        id: 'hoursShort',
      })} ${m}${intl.formatMessage({ id: 'minutesShort' })} ${s}${intl.formatMessage({ id: 'secondsShort' })}`;
    }
    case 'boolean':
      return intl.formatMessage({ id: value ? 'true' : 'false' });
    case 'object':
      return JSON.stringify(value);
    case 'string':
    case 'undefined':
    case 'null':
      return toString(value);
    default:
      return '\u00A0';
  }
};

export const formatWidgetChartValue = (value: unknown, valueType: WidgetValueType): number => {
  if (isNil(value) || !isNumber(value)) {
    return 0;
  }
  switch (valueType) {
    case 'bytes':
      return roundNumber(value / 1024 / 1024, 0);
    default:
      return value;
  }
};
