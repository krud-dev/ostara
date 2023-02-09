import React, { ComponentType, FunctionComponent, useMemo } from 'react';
import { DashboardWidgetCardProps, Widget } from 'renderer/components/widget/widget';
import NotSupportedDashboardWidget from 'renderer/components/widget/card/NotSupportedDashboardWidget';
import ProgressCircleDashboardWidget from 'renderer/components/widget/card/ProgressCircleDashboardWidget';
import StackedTimelineDashboardWidget from 'renderer/components/widget/card/StackedTimelineDashboardWidget';
import DataBarDashboardWidget from 'renderer/components/widget/card/DataBarDashboardWidget';
import { ItemRO } from '../../definitions/daemon';

interface DashboardWidgetProps {
  widget: Widget;
  item: ItemRO;
  intervalSeconds: number;
}

const DashboardWidget: FunctionComponent<DashboardWidgetProps> = ({ widget, item, intervalSeconds }) => {
  const DashboardCard = useMemo<ComponentType<DashboardWidgetCardProps<any>>>(() => {
    switch (widget.type) {
      case 'progress-circle':
        return ProgressCircleDashboardWidget;
      case 'stacked-timeline':
        return StackedTimelineDashboardWidget;
      case 'data-bar':
        return DataBarDashboardWidget;
      default:
        return NotSupportedDashboardWidget;
    }
  }, [widget]);

  return <DashboardCard widget={widget} item={item} intervalSeconds={intervalSeconds} />;
};
export default DashboardWidget;
