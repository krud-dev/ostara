import React, { FunctionComponent, useCallback, useMemo, useState } from 'react';
import { DashboardWidgetCardProps, ProgressCircleWidget } from 'renderer/components/widget/widget';
import DashboardGenericCard from 'renderer/components/widget/card/DashboardGenericCard';
import useWidgetSubscribeToMetrics from 'renderer/components/widget/hooks/useWidgetSubscribeToMetrics';
import { chain, isEmpty } from 'lodash';
import RadialBarSingle from 'renderer/components/widget/pure/RadialBarSingle';
import { InstanceMetricRO } from '../../../../common/generated_definitions';
import { FormattedMessage, useIntl } from 'react-intl';
import useWidgetErrorMetrics from '../hooks/useWidgetErrorMetrics';

const ProgressCircleDashboardWidget: FunctionComponent<DashboardWidgetCardProps<ProgressCircleWidget>> = ({
  widget,
  item,
}) => {
  const intl = useIntl();

  const [data, setData] = useState<{ current?: number; max?: number }>({ current: undefined, max: undefined });

  const title = useMemo<string>(() => intl.formatMessage({ id: widget.titleId }), [widget.titleId]);
  const loading = useMemo<boolean>(() => data.current === undefined || data.max === undefined, [data]);
  const percent = useMemo<number>(() => Math.round(((data.current ?? 0) / (data.max ?? 1)) * 10000) / 100, [data]);
  const color = useMemo<string>(() => {
    if (isEmpty(widget.colorThresholds)) {
      return widget.color;
    }
    return chain(widget.colorThresholds)
      .filter((threshold) => percent >= threshold.value)
      .maxBy((threshold) => threshold.value)
      .value().color;
  }, [percent, widget]);

  const onMetricUpdate = useCallback(
    (metricDto?: InstanceMetricRO): void => {
      if (!metricDto) {
        return;
      }
      if (metricDto.name === widget.currentMetricName) {
        setData((prev) => ({ ...prev, current: metricDto.value.value }));
      } else {
        setData((prev) => ({ ...prev, max: metricDto.value.value }));
      }
    },
    [widget, setData]
  );

  const { error, onMetricError } = useWidgetErrorMetrics(loading);

  const metricNames = useMemo<string[]>(() => [widget.maxMetricName, widget.currentMetricName], [widget]);

  useWidgetSubscribeToMetrics(item.id, metricNames, { callback: onMetricUpdate, errorCallback: onMetricError });

  return (
    <DashboardGenericCard title={<FormattedMessage id={widget.titleId} />} loading={loading} error={error}>
      <RadialBarSingle title={title} color={color} percent={percent} />
    </DashboardGenericCard>
  );
};
export default ProgressCircleDashboardWidget;
