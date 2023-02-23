import React, { FunctionComponent } from 'react';
import { FormattedMessage } from 'react-intl';

interface FormattedBooleanProps {
  value: boolean;
}

const FormattedBoolean: FunctionComponent<FormattedBooleanProps> = ({ value }) => {
  return <FormattedMessage id={value ? 'true' : 'false'} />;
};
export default FormattedBoolean;
