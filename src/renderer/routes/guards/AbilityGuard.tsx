import { ReactNode, useMemo } from 'react';
import { Navigate } from 'react-router-dom';
import { urls } from '../urls';
import { InstanceAbility } from '../../../common/generated_definitions';
import { useNavigatorTree } from '../../contexts/NavigatorTreeContext';
import { getItemUrl } from '../../utils/itemUtils';

type EntityGuardProps = {
  ability: InstanceAbility;
  children: ReactNode;
};

export default function AbilityGuard({ ability, children }: EntityGuardProps) {
  const { selectedItem, selectedItemAbilities } = useNavigatorTree();
  const errorUrl = useMemo(() => (selectedItem ? getItemUrl(selectedItem) : urls.home.url), [selectedItem]);

  if (!selectedItemAbilities || !selectedItemAbilities.includes(ability)) {
    return <Navigate to={errorUrl} />;
  }

  return <>{children}</>;
}
