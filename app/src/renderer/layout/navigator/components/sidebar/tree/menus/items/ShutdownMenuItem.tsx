import { useCallback, useMemo } from 'react';
import { FormattedMessage } from 'react-intl';
import CustomMenuItem from 'renderer/components/menu/item/CustomMenuItem';
import { ItemRO } from '../../../../../../../definitions/daemon';
import { useGetItemAbilitiesQuery } from '../../../../../../../apis/requests/item/getItemAbilities';
import { useShutdownInstance } from '../../../../../../../apis/requests/instance/shutdown/shutdownInstance';
import NiceModal from '@ebay/nice-modal-react';
import ConfirmationDialog from '../../../../../../../components/dialog/ConfirmationDialog';
import { getItemDisplayName } from '../../../../../../../utils/itemUtils';
import Divider from '@mui/material/Divider';

type DeleteMenuItemProps = {
  item: ItemRO;
  onClose?: () => void;
};

export default function ShutdownMenuItem({ item, onClose }: DeleteMenuItemProps) {
  const abilitiesState = useGetItemAbilitiesQuery({ item: item });

  const visible = useMemo<boolean>(
    () => !!abilitiesState.data && abilitiesState.data.includes('SHUTDOWN'),
    [abilitiesState.data]
  );

  const shutdownState = useShutdownInstance();

  const showdownHandler = useCallback(async (): Promise<void> => {
    onClose?.();

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
    } catch (e) {}
  }, [item, shutdownState]);

  if (!visible) {
    return null;
  }

  return (
    <>
      <Divider />

      <CustomMenuItem
        icon={'PowerSettingsNewOutlined'}
        text={<FormattedMessage id={'shutdown'} />}
        onClick={showdownHandler}
        color={'error.main'}
      />
    </>
  );
}
