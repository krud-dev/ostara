import { useCallback } from 'react';
import { FormattedMessage } from 'react-intl';
import { Item } from 'infra/configuration/model/configuration';
import { useSnackbar } from 'notistack';
import copy from 'copy-to-clipboard';
import { useUi } from 'renderer/contexts/UiContext';
import CustomMenuItem from 'renderer/components/menu/item/CustomMenuItem';

type CopyIdToClipboardMenuItemProps = {
  item: Item;
  onClose?: () => void;
};

export default function CopyIdToClipboardMenuItem({ item, onClose }: CopyIdToClipboardMenuItemProps) {
  const { enqueueSnackbar } = useSnackbar();
  const { developerMode } = useUi();

  const copyHandler = useCallback(async (): Promise<void> => {
    onClose?.();

    const result = copy(item.id);
    enqueueSnackbar(<FormattedMessage id={result ? 'copyToClipboardSuccess' : 'copyIdToClipboardFailed'} />, {
      variant: result ? 'success' : 'error',
    });
  }, [onClose, item]);

  if (!developerMode) {
    return null;
  }

  return (
    <CustomMenuItem icon={'ContentCopyOutlined'} text={<FormattedMessage id={'copyId'} />} onClick={copyHandler} />
  );
}
