import React, { FunctionComponent, useMemo } from 'react';
import { Authentication$BearerToken } from '../../../../../common/generated_definitions';
import { FormattedMessage } from 'react-intl';
import DetailsLabelValueHorizontal from '../../../table/details/DetailsLabelValueHorizontal';
import { EffectiveAuthenticationDetailsProps } from './EffectiveAuthenticationDetails';

const EffectiveAuthenticationDetailsBearer: FunctionComponent<EffectiveAuthenticationDetailsProps> = ({
  effectiveAuthentication,
}: EffectiveAuthenticationDetailsProps) => {
  const authentication = useMemo<Authentication$BearerToken>(
    () => effectiveAuthentication.authentication as Authentication$BearerToken,
    [effectiveAuthentication.authentication]
  );

  return (
    <>
      <DetailsLabelValueHorizontal label={<FormattedMessage id={'token'} />} value={authentication.token} />
    </>
  );
};

export default EffectiveAuthenticationDetailsBearer;
