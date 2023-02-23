import { useMemo } from 'react';
import { useUi } from 'renderer/contexts/UiContext';
import cronstrue from 'cronstrue/i18n';

type FormattedCronProps = {
  value: string;
};

export default function FormattedCron({ value }: FormattedCronProps) {
  const { localeInfo } = useUi();

  const prettyCron = useMemo<string>(() => cronstrue.toString(value, { locale: localeInfo.id }), [value]);

  return <>{prettyCron}</>;
}
