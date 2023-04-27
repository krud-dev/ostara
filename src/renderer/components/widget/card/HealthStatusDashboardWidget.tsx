import React, { FunctionComponent, useMemo } from 'react';
import { DashboardWidgetCardProps, HealthStatusWidget } from 'renderer/components/widget/widget';
import DashboardGenericCard from 'renderer/components/widget/card/DashboardGenericCard';
import { isNil } from 'lodash';
import { CardContent, Typography } from '@mui/material';
import { EMPTY_STRING } from '../../../constants/ui';
import { FormattedMessage } from 'react-intl';
import { getItemHealthStatusColor, getItemHealthStatusTextId } from '../../../utils/itemUtils';

const HealthStatusDashboardWidget: FunctionComponent<DashboardWidgetCardProps<HealthStatusWidget>> = ({
  widget,
  item,
  variant,
  sx,
}) => {
  const healthStatusColor = useMemo<string | undefined>(() => getItemHealthStatusColor(item), [item]);
  const healthTextId = useMemo<string | undefined>(() => getItemHealthStatusTextId(item), [item]);

  const loading = useMemo<boolean>(() => !healthTextId, [healthTextId]);

  return (
    <DashboardGenericCard title={widget.title} loading={loading} variant={variant} sx={sx}>
      <CardContent>
        <Typography variant={'h3'} noWrap sx={{ textAlign: 'center', color: healthStatusColor }}>
          {!isNil(healthTextId) ? <FormattedMessage id={healthTextId} /> : EMPTY_STRING}
        </Typography>
      </CardContent>
    </DashboardGenericCard>
  );
};
export default HealthStatusDashboardWidget;
