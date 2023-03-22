import React, { FunctionComponent, useMemo } from 'react';
import { Authentication$QueryString } from '../../../../../common/generated_definitions';
import { FormattedMessage } from 'react-intl';
import DetailsLabelValueHorizontal from '../../../table/details/DetailsLabelValueHorizontal';
import { EffectiveAuthenticationDetailsProps } from './EffectiveAuthenticationDetails';

const EffectiveAuthenticationDetailsQuerystring: FunctionComponent<EffectiveAuthenticationDetailsProps> = ({
  effectiveAuthentication,
}: EffectiveAuthenticationDetailsProps) => {
  const authentication = useMemo<Authentication$QueryString>(
    () => effectiveAuthentication.authentication as Authentication$QueryString,
    [effectiveAuthentication.authentication]
  );

  return (
    <>
      <DetailsLabelValueHorizontal label={<FormattedMessage id={'key'} />} value={authentication.key} />
      <DetailsLabelValueHorizontal label={<FormattedMessage id={'value'} />} value={authentication.value} />
    </>
  );
};

export default EffectiveAuthenticationDetailsQuerystring;
