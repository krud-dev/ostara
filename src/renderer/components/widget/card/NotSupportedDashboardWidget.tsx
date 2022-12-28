import React, { FunctionComponent } from 'react';
import { Widget } from 'infra/dashboard/model';
import { DashboardWidgetCardProps } from 'renderer/components/widget/widget';
import DashboardGenericCard from 'renderer/components/widget/card/DashboardGenericCard';
import { FormattedMessage } from 'react-intl';
import { CardContent, Typography } from '@mui/material';

const NotSupportedDashboardWidget: FunctionComponent<DashboardWidgetCardProps<Widget>> = ({ widget, item }) => {
  return (
    <DashboardGenericCard title={widget.title} loading={false}>
      <CardContent>
        <Typography variant="body2" sx={{ color: 'error.main' }}>
          <FormattedMessage id="notSupported" />
        </Typography>
      </CardContent>
    </DashboardGenericCard>
  );
};
export default NotSupportedDashboardWidget;
