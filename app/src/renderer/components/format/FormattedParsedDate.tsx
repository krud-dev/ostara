import React, { FunctionComponent } from 'react';
import { ParsedDate } from '../../../common/generated_definitions';
import FormattedDateAndRelativeTime from './FormattedDateAndRelativeTime';

interface FormattedParsedDateProps {
  value: ParsedDate;
  showRelative?: boolean;
  updateIntervalInSeconds?: number;
}

const FormattedParsedDate: FunctionComponent<FormattedParsedDateProps> = ({
  value,
  showRelative = false,
  updateIntervalInSeconds,
}) => {
  return (
    <>
      {value.date ? (
        <FormattedDateAndRelativeTime
          value={value.date}
          showRelative={showRelative}
          updateIntervalInSeconds={updateIntervalInSeconds}
        />
      ) : (
        value.original
      )}
    </>
  );
};
export default FormattedParsedDate;
