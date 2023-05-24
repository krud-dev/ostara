import React, { FunctionComponent, useMemo } from 'react';
import { Authentication$Header } from '../../../../../common/generated_definitions';
import { FormattedMessage } from 'react-intl';
import DetailsLabelValueHorizontal from '../../../table/details/DetailsLabelValueHorizontal';
import { EffectiveAuthenticationDetailsProps } from './EffectiveAuthenticationDetails';

const EffectiveAuthenticationDetailsHeader: FunctionComponent<EffectiveAuthenticationDetailsProps> = ({
  effectiveAuthentication,
}: EffectiveAuthenticationDetailsProps) => {
  const authentication = useMemo<Authentication$Header>(
    () => effectiveAuthentication.authentication as Authentication$Header,
    [effectiveAuthentication.authentication]
  );

  return (
    <>
      <DetailsLabelValueHorizontal label={<FormattedMessage id={'name'} />} value={authentication.headerName} />
      <DetailsLabelValueHorizontal label={<FormattedMessage id={'value'} />} value={authentication.headerValue} />
    </>
  );
};

export default EffectiveAuthenticationDetailsHeader;
