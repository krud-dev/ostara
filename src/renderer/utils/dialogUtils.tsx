import NiceModal from '@ebay/nice-modal-react';
import ConfirmationDialog from 'renderer/components/dialog/ConfirmationDialog';
import { FormattedMessage } from 'react-intl';
import { Application, Folder, Instance, Item } from 'infra/configuration/model/configuration';
import { isArray } from 'lodash';
import UpdateFolderDialog from 'renderer/components/item/dialogs/update/UpdateFolderDialog';
import UpdateApplicationDialog from 'renderer/components/item/dialogs/update/UpdateApplicationDialog';
import UpdateInstanceDialog from 'renderer/components/item/dialogs/update/UpdateInstanceDialog';

export const showDeleteConfirmationDialog = async (items: Item | Item[]): Promise<boolean> => {
  const itemsName = isArray(items) ? items.map((i) => i.alias).join(', ') : items.alias;
  return await NiceModal.show<boolean>(ConfirmationDialog, {
    title: <FormattedMessage id={'delete'} />,
    text: <FormattedMessage id={'areYouSureYouWantToDelete'} values={{ name: itemsName }} />,
    continueText: <FormattedMessage id={'delete'} />,
    continueColor: 'error',
  });
};
export const showUpdateItemDialog = async (item: Item): Promise<Item | undefined> => {
  switch (item.type) {
    case 'folder':
      return await NiceModal.show<Folder | undefined>(UpdateFolderDialog, {
        item: item,
      });
    case 'application':
      return await NiceModal.show<Application | undefined>(UpdateApplicationDialog, {
        item: item,
      });
    case 'instance':
      return await NiceModal.show<Instance | undefined>(UpdateInstanceDialog, {
        item: item,
      });
    default:
      throw new Error(`Unknown item type`);
  }
};
