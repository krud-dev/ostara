import { Widget } from 'infra/dashboard/model';
import { Item } from 'infra/configuration/model/configuration';

export interface DashboardWidgetCardProps<W extends Widget> {
  widget: W;
  item: Item;
}
