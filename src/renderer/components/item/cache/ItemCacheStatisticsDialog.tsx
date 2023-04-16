import { FormattedMessage } from 'react-intl';
import React, { FunctionComponent, useCallback, useMemo } from 'react';
import { Box, Dialog, DialogContent } from '@mui/material';
import { useModal } from '@ebay/nice-modal-react';
import DialogTitleEnhanced from 'renderer/components/dialog/DialogTitleEnhanced';
import PerfectScrollbar from 'react-perfect-scrollbar';
import LogoLoader from '../../common/LogoLoader';
import ItemCacheDetails, { ItemCacheStatistics } from './ItemCacheDetails';
import { ToolbarButtonProps } from '../../common/ToolbarButton';
import { BaseUseQueryResult } from '../../../apis/requests/base/useBaseQuery';

export type ItemCacheStatisticsDialogProps = {
  cacheName: string;
  statistics?: ItemCacheStatistics;
  queryState: BaseUseQueryResult<any>;
};

const ItemCacheStatisticsDialog: FunctionComponent<ItemCacheStatisticsDialogProps> = ({
  cacheName,
  statistics,
  queryState,
}) => {
  const modal = useModal();

  const closeHandler = useCallback((): void => {
    modal.resolve(undefined);
    modal.hide();
  }, [modal]);

  const refreshHandler = useCallback((): void => {
    queryState.refetch();
  }, [queryState]);

  const buttons = useMemo<ToolbarButtonProps[]>(
    () => [
      {
        icon: 'RefreshOutlined',
        tooltip: <FormattedMessage id={'refresh'} />,
        disabled: queryState.isLoading,
        onClick: refreshHandler,
      },
    ],
    [queryState.isLoading, refreshHandler]
  );

  return (
    <Dialog
      open={modal.visible}
      onClose={closeHandler}
      TransitionProps={{
        onExited: () => modal.remove(),
      }}
      fullWidth
      maxWidth={false}
    >
      <DialogTitleEnhanced onClose={closeHandler} buttons={buttons}>
        {cacheName}
        {' - '}
        <FormattedMessage id={'statistics'} />
      </DialogTitleEnhanced>
      <Box sx={{ height: '100%', overflow: 'hidden' }}>
        <PerfectScrollbar>
          {!statistics ? (
            <DialogContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <LogoLoader />
            </DialogContent>
          ) : (
            <DialogContent>
              <ItemCacheDetails statistics={statistics} />
            </DialogContent>
          )}
        </PerfectScrollbar>
      </Box>
    </Dialog>
  );
};

export default ItemCacheStatisticsDialog;
