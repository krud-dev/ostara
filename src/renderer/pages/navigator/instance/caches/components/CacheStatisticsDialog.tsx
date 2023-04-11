import { FormattedMessage } from 'react-intl';
import React, { FunctionComponent, useCallback, useMemo } from 'react';
import { Box, Dialog, DialogContent } from '@mui/material';
import NiceModal, { NiceModalHocProps, useModal } from '@ebay/nice-modal-react';
import DialogTitleEnhanced from 'renderer/components/dialog/DialogTitleEnhanced';
import PerfectScrollbar from 'react-perfect-scrollbar';
import LogoLoader from '../../../../../components/common/LogoLoader';
import { EnrichedInstanceCacheRO } from '../../../../../apis/requests/instance/caches/getInstanceCaches';
import { useGetInstanceCacheStatisticsQuery } from '../../../../../apis/requests/instance/caches/getInstanceCacheStatistics';
import ItemCacheDetails, { ItemCacheStatistics } from '../../../../../components/item/cache/ItemCacheDetails';
import { ToolbarButtonProps } from '../../../../../components/common/ToolbarButton';

export type CacheStatisticsDialogProps = {
  row: EnrichedInstanceCacheRO;
};

const CacheStatisticsDialog: FunctionComponent<CacheStatisticsDialogProps & NiceModalHocProps> = NiceModal.create(
  ({ row }) => {
    const modal = useModal();

    const statisticsQuery = useGetInstanceCacheStatisticsQuery({ instanceId: row.instanceId, cacheName: row.name });
    const statistics = useMemo<ItemCacheStatistics | undefined>(
      () =>
        statisticsQuery.data
          ? {
              gets: { value: statisticsQuery.data.gets },
              puts: { value: statisticsQuery.data.puts },
              evictions: { value: statisticsQuery.data.evictions },
              hits: { value: statisticsQuery.data.hits },
              misses: { value: statisticsQuery.data.misses },
              removals: { value: statisticsQuery.data.removals },
              size: { value: statisticsQuery.data.size },
            }
          : undefined,
      [statisticsQuery.data]
    );

    const closeHandler = useCallback((): void => {
      modal.resolve(undefined);
      modal.hide();
    }, [modal]);

    const refreshHandler = useCallback((): void => {
      statisticsQuery.refetch();
    }, [statisticsQuery]);

    const buttons = useMemo<ToolbarButtonProps[]>(
      () => [
        {
          icon: 'RefreshOutlined',
          tooltipLabelId: 'refresh',
          disabled: statisticsQuery.isLoading,
          onClick: refreshHandler,
        },
      ],
      [statisticsQuery.isLoading, refreshHandler]
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
          {row.name}
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
  }
);

export default CacheStatisticsDialog;
