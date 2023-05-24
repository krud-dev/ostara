import { TableRow, TableCell } from '@mui/material';
import EmptyContent from 'renderer/components/help/EmptyContent';
import { FormattedMessage } from 'react-intl';
import { useTable } from './TableContext';

export default function TableNoData() {
  const { emptyContent } = useTable();
  return (
    <TableRow>
      <TableCell colSpan={999}>
        <EmptyContent
          text={<FormattedMessage id={'noData'} />}
          description={emptyContent}
          sx={{
            '& span.MuiBox-root': { height: 160 },
          }}
        />
      </TableCell>
    </TableRow>
  );
}
