import React, { FunctionComponent } from 'react';
import { FormattedMessage } from 'react-intl';
import { FALSE_LABEL_ID, TRUE_LABEL_ID } from '../../constants/ui';

interface FormattedBooleanProps {
  value: boolean;
}

const FormattedBoolean: FunctionComponent<FormattedBooleanProps> = ({ value }) => {
  return <FormattedMessage id={value ? TRUE_LABEL_ID : FALSE_LABEL_ID} />;
};
export default FormattedBoolean;
