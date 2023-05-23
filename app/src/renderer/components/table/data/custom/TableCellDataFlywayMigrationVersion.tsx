import { EntityBaseColumn } from 'renderer/entity/entity';
import { FormattedMessage } from 'react-intl';
import { EnrichedFlywayMigration } from '../../../../apis/requests/instance/flyway/getInstanceFlywayMigrations';

type TableCellDataFlywayMigrationVersionProps<EntityItem extends EnrichedFlywayMigration> = {
  row: EntityItem;
  column: EntityBaseColumn<EntityItem>;
};

export default function TableCellDataFlywayMigrationVersion<EntityItem extends EnrichedFlywayMigration>({
  row,
  column,
}: TableCellDataFlywayMigrationVersionProps<EntityItem>) {
  return <>{row.version || <FormattedMessage id={'repeating'} />}</>;
}
