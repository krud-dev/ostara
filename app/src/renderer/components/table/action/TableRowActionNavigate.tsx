import { EntityRowActionNavigate } from 'renderer/entity/entity';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export type TableRowActionNavigateProps<EntityItem> = {
  row: EntityItem;
  action: EntityRowActionNavigate<EntityItem>;
  open: boolean;
};

export default function TableRowActionNavigate<EntityItem>({
  row,
  action,
  open,
}: TableRowActionNavigateProps<EntityItem>) {
  const navigate = useNavigate();

  useEffect(() => {
    if (open) {
      navigate(action.getUrl(row));
    }
  }, [open]);
  return null;
}
