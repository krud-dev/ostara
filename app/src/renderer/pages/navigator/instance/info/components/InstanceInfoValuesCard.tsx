import { Card, CardContent, CardHeader, Collapse } from '@mui/material';
import React, { ReactNode, useCallback, useMemo, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import DetailsLabelValueHorizontal from 'renderer/components/table/details/DetailsLabelValueHorizontal';
import ToolbarButton from 'renderer/components/common/ToolbarButton';
import { isEmpty } from 'lodash';

export type InstanceInfoCardValue = {
  id: string;
  label: ReactNode;
  value: ReactNode;
  advanced?: boolean;
  hide?: boolean;
};

type InstanceInfoValuesCardProps = {
  title: ReactNode;
  values: InstanceInfoCardValue[];
};

export default function InstanceInfoValuesCard({ title, values }: InstanceInfoValuesCardProps) {
  const [showMore, setShowMore] = useState<boolean>(false);

  const toggleShowMoreHandler = useCallback((): void => {
    setShowMore((prev) => !prev);
  }, [setShowMore]);

  const regularValues = useMemo<InstanceInfoCardValue[]>(
    () => values.filter((value) => !value.hide && !value.advanced),
    [values]
  );
  const advancedValues = useMemo<InstanceInfoCardValue[]>(
    () => values.filter((value) => !value.hide && value.advanced),
    [values]
  );

  const hasShowMore = useMemo<boolean>(() => !isEmpty(advancedValues), [values]);

  return (
    <Card>
      <CardHeader
        title={title}
        action={
          hasShowMore ? (
            <ToolbarButton
              tooltip={<FormattedMessage id={showMore ? 'showLess' : 'showMore'} />}
              icon={showMore ? 'UnfoldLessOutlined' : 'UnfoldMoreOutlined'}
              onClick={toggleShowMoreHandler}
            />
          ) : undefined
        }
      />
      <CardContent>
        {regularValues.map((value) => (
          <DetailsLabelValueHorizontal label={value.label} value={value.value} key={value.id} />
        ))}
        {hasShowMore && (
          <Collapse in={showMore} timeout="auto" unmountOnExit>
            {advancedValues.map((value) => (
              <DetailsLabelValueHorizontal label={value.label} value={value.value} key={value.id} />
            ))}
          </Collapse>
        )}
      </CardContent>
    </Card>
  );
}
