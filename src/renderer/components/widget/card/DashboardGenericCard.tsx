import React, { FunctionComponent, PropsWithChildren, ReactNode, useMemo } from 'react';
import { Card, CardContent, CardHeader } from '@mui/material';
import EmptyContent from 'renderer/components/help/EmptyContent';
import { FormattedMessage } from 'react-intl';
import LogoLoader from '../../common/LogoLoader';
import { SxProps } from '@mui/system';
import { Theme } from '@mui/material/styles';

type DashboardGenericCardProps = {
  title?: ReactNode;
  loading?: boolean;
  empty?: boolean;
  variant?: 'outlined' | 'elevation';
  sx?: SxProps<Theme>;
} & PropsWithChildren;

const DashboardGenericCard: FunctionComponent<DashboardGenericCardProps> = ({
  title,
  loading,
  empty,
  variant,
  sx,
  children,
}) => {
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
    <Card variant={variant} sx={{ height: '100%', ...sx }}>
      {title && <CardHeader title={title} />}
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
