import { useCallback, useMemo, useState } from 'react';
import { useAnalytics } from '../contexts/AnalyticsContext';
import NiceModal from '@ebay/nice-modal-react';
import ConfirmationDialog from '../components/dialog/ConfirmationDialog';
import { FormattedMessage } from 'react-intl';
import { getItemDisplayName } from '../utils/itemUtils';
import { useShutdownInstance } from '../apis/requests/instance/shutdown/shutdownInstance';
import { useSnackbar } from 'notistack';
import { ItemRO } from '../definitions/daemon';

type ItemShutdownResult = {
  itemShutdown: (item: ItemRO) => Promise<void>;
  loading: boolean;
};

const useItemShutdown = (): ItemShutdownResult => {
  const { enqueueSnackbar } = useSnackbar();
  const { track } = useAnalytics();

  const [loading, setLoading] = useState<boolean>(false);

  const shutdownState = useShutdownInstance();

  const shutdown = useCallback(
    async (item: ItemRO): Promise<void> => {
      track({ name: 'item_shutdown' });

      setLoading(true);

      const confirm = await NiceModal.show<boolean>(ConfirmationDialog, {
        title: <FormattedMessage id={'shutdown'} />,
        text: <FormattedMessage id={'areYouSureYouWantToShutdown'} values={{ name: getItemDisplayName(item) }} />,
        continueText: <FormattedMessage id={'shutdown'} />,
        continueColor: 'error',
      });
      if (!confirm) {
        return;
      }

      try {
        await shutdownState.mutateAsync({ instanceId: item.id });
        enqueueSnackbar(<FormattedMessage id={'shutdownRequestSuccessful'} />, { variant: 'success' });
      } catch (e) {}

      setLoading(false);
    },
    [setLoading, shutdownState, enqueueSnackbar]
  );

  return useMemo<ItemShutdownResult>(() => ({ itemShutdown: shutdown, loading }), [shutdown, loading]);
};
export default useItemShutdown;
