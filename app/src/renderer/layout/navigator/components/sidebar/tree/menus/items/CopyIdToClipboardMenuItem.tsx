import { useCallback } from 'react';
import { FormattedMessage } from 'react-intl';
import { useSettingsContext } from 'renderer/contexts/SettingsContext';
import CustomMenuItem from 'renderer/components/menu/item/CustomMenuItem';
import useCopyToClipboard from 'renderer/hooks/useCopyToClipboard';
import { ItemRO } from 'renderer/definitions/daemon';

type CopyIdToClipboardMenuItemProps = {
  item: ItemRO;
  onClose?: () => void;
};

export default function CopyIdToClipboardMenuItem({ item, onClose }: CopyIdToClipboardMenuItemProps) {
  const { developerMode } = useSettingsContext();
  const copyToClipboard = useCopyToClipboard();

  const copyHandler = useCallback((): void => {
    onClose?.();
    copyToClipboard(item.id);
  }, [onClose, copyToClipboard, item]);

  if (!developerMode) {
    return null;
  }

  return (
    <CustomMenuItem icon={'ContentCopyOutlined'} text={<FormattedMessage id={'copyId'} />} onClick={copyHandler} />
  );
}
