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
      return formatBytes(value);
    }
    case 'seconds': {
      if (!isNumber(value)) {
        return toString(value);
      }
      return formatCountdown(value * 1000, intl);
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

export const formatCountdown = (millis: number, intl: IntlShape): string => {
  const days = Math.floor(millis / 86400000);
  const hours = Math.floor((millis % 86400000) / 3600000);
  const minutes = Math.floor((millis % 3600000) / 60000);
  const seconds = Math.floor((millis % 60000) / 1000);

  const d = days > 0 ? `${days}${intl.formatMessage({ id: 'daysShort' })} ` : '';
  const h = `${padValue(hours)}${intl.formatMessage({ id: 'hoursShort' })} `;
  const m = `${padValue(minutes)}${intl.formatMessage({ id: 'minutesShort' })} `;
  const s = `${padValue(seconds)}${intl.formatMessage({ id: 'secondsShort' })}`;

  return `${d}${h}${m}${s}`;
};

export const formatInterval = (millis: number, intl: IntlShape): string => {
  if (millis === 0) {
    return '0';
  }

  const days = Math.floor(millis / 86400000);
  const hours = Math.floor((millis % 86400000) / 3600000);
  const minutes = Math.floor((millis % 3600000) / 60000);
  const seconds = Math.floor((millis % 60000) / 1000);
  const milliseconds = Math.floor(millis % 1000);

  const d = days > 0 ? `${days}${intl.formatMessage({ id: 'daysShort' })} ` : '';
  const h = hours > 0 ? `${hours}${intl.formatMessage({ id: 'hoursShort' })} ` : '';
  const m = minutes > 0 ? `${minutes}${intl.formatMessage({ id: 'minutesShort' })} ` : '';
  const s = seconds > 0 ? `${seconds}${intl.formatMessage({ id: 'secondsShort' })}` : '';
  const ms = milliseconds > 0 ? ` ${milliseconds}${intl.formatMessage({ id: 'millisecondsShort' })}` : '';

  return `${d}${h}${m}${s}${ms}`;
};

export const formatBytes = (bytes: number): string => {
  if (bytes >= 1024 * 1024 * 1024) {
    return `${roundNumber(bytes / 1024 / 1024 / 1024, 2)} GB`;
  }
  return `${roundNumber(bytes / 1024 / 1024, 2)} MB`;
};
