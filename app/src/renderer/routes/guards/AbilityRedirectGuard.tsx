import { ReactNode, useMemo } from 'react';
import { Navigate } from 'react-router-dom';
import { urls } from 'renderer/routes/urls';
import { InstanceAbility } from 'common/generated_definitions';
import { getItemUrl } from 'renderer/utils/itemUtils';
import { useNavigatorLayoutContext } from 'renderer/contexts/NavigatorLayoutContext';

type AbilityRedirectGuardProps = {
  ability: InstanceAbility;
  children: ReactNode;
};

export default function AbilityRedirectGuard({ ability, children }: AbilityRedirectGuardProps) {
  const { selectedItem, selectedItemAbilities } = useNavigatorLayoutContext();
  const hasAbility = useMemo(() => !!selectedItemAbilities?.includes(ability), [selectedItemAbilities, ability]);
  const errorUrl = useMemo(() => (selectedItem ? getItemUrl(selectedItem) : urls.home.url), [selectedItem]);

  if (!hasAbility) {
    return <Navigate to={errorUrl} />;
  }

  return <>{children}</>;
}
