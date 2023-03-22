import React, { FunctionComponent, useCallback, useMemo, useState } from 'react';
import { CountdownWidget, DashboardWidgetCardProps } from 'renderer/components/widget/widget';
import DashboardGenericCard from 'renderer/components/widget/card/DashboardGenericCard';
import { isNil } from 'lodash';
import { CardContent, Typography } from '@mui/material';
import useWidgetSubscribeToMetrics from 'renderer/components/widget/hooks/useWidgetSubscribeToMetrics';
import { InstanceMetricRO } from '../../../../common/generated_definitions';
import { EMPTY_STRING } from '../../../constants/ui';
import { FormattedMessage } from 'react-intl';
import CountdownValue from '../metric/CountdownValue';

const CountdownDashboardWidget: FunctionComponent<DashboardWidgetCardProps<CountdownWidget>> = ({ widget, item }) => {
  const [data, setData] = useState<InstanceMetricRO | undefined>(undefined);
  const loading = useMemo<boolean>(() => !data, [data]);

  const seconds = useMemo<number | undefined>(() => data?.values[0]?.value, [data]);

  const onMetricUpdate = useCallback(
    (metricDto?: InstanceMetricRO): void => {
      if (!metricDto) {
        return;
      }
      setData(metricDto);
    },
    [setData]
  );

  const metricNames = useMemo<string[]>(() => [widget.metricName], [widget]);

  useWidgetSubscribeToMetrics(item.id, metricNames, onMetricUpdate);

  return (
    <DashboardGenericCard title={<FormattedMessage id={widget.titleId} />} loading={loading}>
      <CardContent>
        <Typography variant={'h3'} noWrap sx={{ textAlign: 'center' }}>
          {!isNil(seconds) ? <CountdownValue seconds={seconds} /> : EMPTY_STRING}
        </Typography>
      </CardContent>
    </DashboardGenericCard>
  );
};
export default CountdownDashboardWidget;
