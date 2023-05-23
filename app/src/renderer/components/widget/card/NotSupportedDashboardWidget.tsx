import React, { FunctionComponent } from 'react';
import { DashboardWidgetCardProps, Widget } from 'renderer/components/widget/widget';
import DashboardGenericCard from 'renderer/components/widget/card/DashboardGenericCard';
import { FormattedMessage } from 'react-intl';
import { CardContent, Typography } from '@mui/material';

const NotSupportedDashboardWidget: FunctionComponent<DashboardWidgetCardProps<Widget>> = ({ widget, item }) => {
  return (
    <DashboardGenericCard title={<FormattedMessage id={widget.titleId} />} loading={false}>
      <CardContent>
        <Typography variant="body2" sx={{ color: 'error.main' }}>
          <FormattedMessage id="notSupported" />
        </Typography>
      </CardContent>
    </DashboardGenericCard>
  );
};
export default NotSupportedDashboardWidget;
