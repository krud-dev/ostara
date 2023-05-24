import React, { FunctionComponent, useMemo } from 'react';
import { Authentication$Basic } from '../../../../../common/generated_definitions';
import { FormattedMessage } from 'react-intl';
import DetailsLabelValueHorizontal from '../../../table/details/DetailsLabelValueHorizontal';
import { EffectiveAuthenticationDetailsProps } from './EffectiveAuthenticationDetails';

const EffectiveAuthenticationDetailsBasic: FunctionComponent<EffectiveAuthenticationDetailsProps> = ({
  effectiveAuthentication,
}: EffectiveAuthenticationDetailsProps) => {
  const authentication = useMemo<Authentication$Basic>(
    () => effectiveAuthentication.authentication as Authentication$Basic,
    [effectiveAuthentication.authentication]
  );

  return (
    <>
      <DetailsLabelValueHorizontal label={<FormattedMessage id={'username'} />} value={authentication.username} />
      <DetailsLabelValueHorizontal label={<FormattedMessage id={'password'} />} value={authentication.password} />
    </>
  );
};

export default EffectiveAuthenticationDetailsBasic;
