import { useMemo } from 'react';
import { useSettingsContext } from 'renderer/contexts/SettingsContext';
import cronstrue from 'cronstrue/i18n';

type FormattedCronProps = {
  value: string;
};

export default function FormattedCron({ value }: FormattedCronProps) {
  const { localeInfo } = useSettingsContext();

  const prettyCron = useMemo<string>(() => cronstrue.toString(value, { locale: localeInfo.id }), [value]);

  return <>{prettyCron}</>;
}
