import { useMemo } from 'react';
import { useSettings } from 'renderer/contexts/SettingsContext';
import cronstrue from 'cronstrue/i18n';

type FormattedCronProps = {
  value: string;
};

export default function FormattedCron({ value }: FormattedCronProps) {
  const { localeInfo } = useSettings();

  const prettyCron = useMemo<string>(() => cronstrue.toString(value, { locale: localeInfo.id }), [value]);

  return <>{prettyCron}</>;
}
