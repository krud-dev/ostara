import React, { FunctionComponent } from 'react';
import { FormattedDate } from 'react-intl';
import FormattedRelativeTimeNow from './FormattedRelativeTimeNow';

interface FormattedDateAndRelativeTimeProps {
  value: number;
}

const FormattedDateAndRelativeTime: FunctionComponent<FormattedDateAndRelativeTimeProps> = ({ value }) => {
  return (
    <>
      <FormattedDate value={value} dateStyle={'short'} timeStyle={'medium'} />
      {' ('}
      <FormattedRelativeTimeNow value={value} />
      {')'}
    </>
  );
};
export default FormattedDateAndRelativeTime;
