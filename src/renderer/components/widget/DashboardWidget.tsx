import React, { ComponentType, FunctionComponent, useMemo } from 'react';
import { Widget } from 'infra/dashboard/model';
import ProgressCircleDashboardWidget from 'renderer/components/widget/card/ProgressCircleDashboardWidget';
import { DashboardWidgetCardProps } from 'renderer/components/widget/widget';
import { Item } from 'infra/configuration/model/configuration';

interface DashboardWidgetProps {
  widget: Widget;
  item: Item;
}

const DashboardWidget: FunctionComponent<DashboardWidgetProps> = ({ widget, item }) => {
  const DashboardCard = useMemo<ComponentType<DashboardWidgetCardProps<any>>>(() => {
    return ProgressCircleDashboardWidget;
    switch (widget.type) {
      case 'progress-circle':
        return ProgressCircleDashboardWidget;
      default:
        throw new Error(`Unknown widget type: ${widget.type}`);
    }
  }, [widget]);

  return <DashboardCard widget={widget} item={item} />;
};
export default DashboardWidget;
