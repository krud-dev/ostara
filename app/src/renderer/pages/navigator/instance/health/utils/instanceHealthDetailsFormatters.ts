import { IntlShape } from 'react-intl';
import { formatWidgetValue, splitCamelCase } from 'renderer/utils/formatUtils';
import { isObject, toString } from 'lodash';

export type InstanceHealthDetailsValueFormatter = (value: any, intl: IntlShape) => string;
export type InstanceHealthDetailsKeyFormatter = (key: string, intl: IntlShape) => string;

const instanceHealthDetailsValueFormatters: { [key: string]: InstanceHealthDetailsValueFormatter } = {
  'diskSpace.total': (value, intl) => formatWidgetValue(value, 'bytes', intl),
  'diskSpace.free': (value, intl) => formatWidgetValue(value, 'bytes', intl),
  'diskSpace.threshold': (value, intl) => formatWidgetValue(value, 'bytes', intl),
  'diskSpace.exists': (value, intl) => formatWidgetValue(value, 'boolean', intl),
};

const defaultValueFormatter: InstanceHealthDetailsValueFormatter = (value, intl) =>
  isObject(value) ? JSON.stringify(value) : toString(value);

export const getInstanceHealthDetailsValueFormatter = (key: string): InstanceHealthDetailsValueFormatter => {
  return instanceHealthDetailsValueFormatters[key] || defaultValueFormatter;
};

const instanceHealthDetailsKeyFormatters: { [key: string]: InstanceHealthDetailsKeyFormatter } = {
  db: (key, intl) => key.toUpperCase(),
};

const defaultKeyFormatter: InstanceHealthDetailsKeyFormatter = (key, intl) => splitCamelCase(key);

export const getInstanceHealthDetailsKeyFormatter = (key: string): InstanceHealthDetailsKeyFormatter => {
  return instanceHealthDetailsKeyFormatters[key] || defaultKeyFormatter;
};
