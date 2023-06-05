import { useCallback } from 'react';
import { IconButton } from '@mui/material';
import MenuPopover from 'renderer/components/menu/popup/MenuPopover';
import { MoreVertOutlined, UnfoldLessDoubleOutlined, UnfoldMoreDoubleOutlined } from '@mui/icons-material';
import { FormattedMessage } from 'react-intl';
import { useNavigatorTree } from 'renderer/contexts/NavigatorTreeContext';
import { bindMenu, usePopupState } from 'material-ui-popup-state/hooks';
import CustomMenuItem from 'renderer/components/menu/item/CustomMenuItem';
import { useAnalytics } from '../../../../../contexts/AnalyticsContext';
import MenuDivider from '../../../../../components/menu/item/MenuDivider';
import NiceModal from '@ebay/nice-modal-react';
import ExportConfigurationDialog from '../dialogs/ExportConfigurationDialog';
import ImportConfigurationDialog from '../dialogs/ImportConfigurationDialog';

export default function SearchItemMenu() {
  const { performAction } = useNavigatorTree();
  const { track } = useAnalytics();

  const menuState = usePopupState({ variant: 'popover' });

  const openHandler = useCallback((): void => {
    menuState.open();
  }, [menuState]);

  const collapseAllHandler = useCallback((): void => {
    performAction('collapseAll');
    menuState.close();
  }, [performAction, menuState]);

  const expandAllHandler = useCallback((): void => {
    performAction('expandAll');
    menuState.close();
  }, [performAction, menuState]);

  const exportHandler = useCallback((): void => {
    track({ name: 'export_all_menu_click' });
    menuState.close();

    NiceModal.show<boolean>(ExportConfigurationDialog, {});
  }, [track, menuState]);

  const importHandler = useCallback((): void => {
    track({ name: 'import_all_menu_click' });
    menuState.close();

    NiceModal.show<boolean>(ImportConfigurationDialog, {});
  }, [track, menuState]);

  return (
    <>
      <IconButton size={'small'} ref={menuState.setAnchorEl} onClick={openHandler}>
        <MoreVertOutlined fontSize={'medium'} />
      </IconButton>

      <MenuPopover {...bindMenu(menuState)}>
        <CustomMenuItem
          icon={'UnfoldLessDoubleOutlined'}
          text={<FormattedMessage id={'collapseAll'} />}
          onClick={collapseAllHandler}
        />
        <CustomMenuItem
          icon={'UnfoldMoreDoubleOutlined'}
          text={<FormattedMessage id={'expandAll'} />}
          onClick={expandAllHandler}
        />
        <MenuDivider />
        <CustomMenuItem
          icon={'FileUploadOutlined'}
          text={<FormattedMessage id={'exportConfiguration'} />}
          onClick={exportHandler}
        />
        <CustomMenuItem
          icon={'FileDownloadOutlined'}
          text={<FormattedMessage id={'importConfiguration'} />}
          onClick={importHandler}
        />
      </MenuPopover>
    </>
  );
}
