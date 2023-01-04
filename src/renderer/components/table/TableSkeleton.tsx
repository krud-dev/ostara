import { Skeleton, TableCell, TableRow, TableRowProps } from '@mui/material';

type TableSkeletonProps = {} & TableRowProps;

export default function TableSkeleton({ ...other }: TableSkeletonProps) {
  return (
    <TableRow {...other}>
      <TableCell colSpan={999}>
        <Skeleton variant="text" width="100%" height={32} />
      </TableCell>
    </TableRow>
  );
}
