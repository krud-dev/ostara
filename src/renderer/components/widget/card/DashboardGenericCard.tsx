import React, { FunctionComponent, PropsWithChildren, ReactNode, useMemo } from 'react';
import { Card, CardContent, CardHeader } from '@mui/material';
import EmptyContent from 'renderer/components/help/EmptyContent';
import { FormattedMessage } from 'react-intl';
import LogoLoader from '../../common/LogoLoader';

type DashboardGenericCardProps = {
  title: ReactNode;
  loading: boolean;
  empty?: boolean;
} & PropsWithChildren;

const DashboardGenericCard: FunctionComponent<DashboardGenericCardProps> = ({ title, loading, empty, children }) => {
  const cardState = useMemo<'loading' | 'empty' | 'content'>(() => {
    if (empty) {
      return 'empty';
    }
    if (loading) {
      return 'loading';
    }
    return 'content';
  }, [loading, empty]);
  return (
    <Card sx={{ height: '100%' }}>
      <CardHeader title={title} />
      {cardState === 'loading' && (
        <CardContent sx={{ textAlign: 'center' }}>
          <LogoLoader />
        </CardContent>
      )}
      {cardState === 'empty' && <EmptyContent text={<FormattedMessage id={'noData'} />} />}
      {cardState === 'content' && children}
    </Card>
  );
};
export default DashboardGenericCard;
