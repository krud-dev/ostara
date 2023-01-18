import * as React from 'react';
import Label from 'renderer/components/common/Label';

type InlineCodeLabelProps = {
  code: string;
};

export const InlineCodeLabel: React.FC<InlineCodeLabelProps> = ({ code }) => {
  return (
    <Label color={'default'} variant={'ghost'}>
      {code}
    </Label>
  );
};
