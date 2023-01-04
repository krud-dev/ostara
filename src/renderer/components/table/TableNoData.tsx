import { TableRow, TableCell } from '@mui/material';
import EmptyContent from 'renderer/components/help/EmptyContent';
import { FormattedMessage } from 'react-intl';

export default function TableNoData() {
  return (
    <TableRow>
      <TableCell colSpan={999}>
        <EmptyContent
          text={<FormattedMessage id={'noData'} />}
          sx={{
            '& span.MuiBox-root': { height: 160 },
          }}
        />
      </TableCell>
    </TableRow>
  );
}
