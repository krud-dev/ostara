import { ReactNode, useMemo } from 'react';
import { Navigate } from 'react-router-dom';
import { urls } from '../urls';
import { InstanceAbility } from '../../../common/generated_definitions';
import { useNavigatorTree } from '../../contexts/NavigatorTreeContext';
import { getItemUrl } from '../../utils/itemUtils';

type AbilityRedirectGuardProps = {
  ability: InstanceAbility;
  children: ReactNode;
};

export default function AbilityRedirectGuard({ ability, children }: AbilityRedirectGuardProps) {
  const { selectedItem, selectedItemAbilities } = useNavigatorTree();
  const hasAbility = useMemo(() => !!selectedItemAbilities?.includes(ability), [selectedItemAbilities, ability]);
  const errorUrl = useMemo(() => (selectedItem ? getItemUrl(selectedItem) : urls.home.url), [selectedItem]);

  if (!hasAbility) {
    return <Navigate to={errorUrl} />;
  }

  return <>{children}</>;
}
