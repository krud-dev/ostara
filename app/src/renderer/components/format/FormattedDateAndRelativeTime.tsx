import React, { FunctionComponent } from 'react';
import { FormattedDate } from 'react-intl';
import FormattedRelativeTimeNow from './FormattedRelativeTimeNow';

interface FormattedDateAndRelativeTimeProps {
  value: number;
  showRelative?: boolean;
  updateIntervalInSeconds?: number;
}

const FormattedDateAndRelativeTime: FunctionComponent<FormattedDateAndRelativeTimeProps> = ({
  value,
  showRelative = true,
  updateIntervalInSeconds,
}) => {
  return (
    <>
      <FormattedDate value={value} dateStyle={'short'} timeStyle={'medium'} />
      {showRelative && (
        <>
          {' ('}
          <FormattedRelativeTimeNow value={value} updateIntervalInSeconds={updateIntervalInSeconds} />
          {')'}
        </>
      )}
    </>
  );
};
export default FormattedDateAndRelativeTime;
