import React, { FunctionComponent, PropsWithChildren, ReactNode, useMemo } from 'react';
import { Box, Card, CardContent, CardHeader } from '@mui/material';
import EmptyContent from 'renderer/components/help/EmptyContent';
import { FormattedMessage } from 'react-intl';
import LogoLoader from '../../common/LogoLoader';

type DashboardGenericCardProps = {
  title: ReactNode;
  loading: boolean;
  empty?: boolean;
  error?: ReactNode;
} & PropsWithChildren;

const DashboardGenericCard: FunctionComponent<DashboardGenericCardProps> = ({
  title,
  loading,
  empty,
  error,
  children,
}) => {
  const cardState = useMemo<'loading' | 'empty' | 'error' | 'content'>(() => {
    if (error) {
      return 'error';
    }
    if (empty) {
      return 'empty';
    }
    if (loading) {
      return 'loading';
    }
    return 'content';
  }, [loading, empty, error]);

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardHeader title={title} />
      {cardState === 'loading' && (
        <Box sx={{ minHeight: 180, flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <LogoLoader />
        </Box>
      )}
      {cardState === 'empty' && (
        <Box sx={{ flexGrow: 1 }}>
          <EmptyContent text={<FormattedMessage id={'noData'} />} />
        </Box>
      )}
      {cardState === 'error' && (
        <Box sx={{ flexGrow: 1 }}>
          <EmptyContent
            text={<FormattedMessage id={'widgetNotAvailable'} />}
            description={error}
            icon={'InfoOutlined'}
          />
        </Box>
      )}
      {cardState === 'content' && children}
    </Card>
  );
};
export default DashboardGenericCard;
