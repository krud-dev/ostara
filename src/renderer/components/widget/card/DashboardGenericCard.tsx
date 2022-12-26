import React, { FunctionComponent, PropsWithChildren, ReactNode } from 'react';
import { Card, CardContent, CardHeader, CircularProgress } from '@mui/material';

type DashboardGenericCardProps = {
  title: ReactNode;
  loading: boolean;
} & PropsWithChildren;

const DashboardGenericCard: FunctionComponent<DashboardGenericCardProps> = ({ title, loading, children }) => {
  return (
    <Card sx={{ height: '100%' }}>
      <CardHeader title={title} />
      {loading ? (
        <CardContent sx={{ textAlign: 'center' }}>
          <CircularProgress />
        </CardContent>
      ) : (
        children
      )}
    </Card>
  );
};
export default DashboardGenericCard;
