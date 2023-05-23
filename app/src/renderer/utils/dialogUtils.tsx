import NiceModal from '@ebay/nice-modal-react';
import ConfirmationDialog from 'renderer/components/dialog/ConfirmationDialog';
import { FormattedMessage } from 'react-intl';
import { isArray } from 'lodash';
import UpdateFolderDialog from 'renderer/components/item/dialogs/update/UpdateFolderDialog';
import UpdateApplicationDialog from 'renderer/components/item/dialogs/update/UpdateApplicationDialog';
import UpdateInstanceDialog from 'renderer/components/item/dialogs/update/UpdateInstanceDialog';
import { ApplicationRO, FolderRO, InstanceRO } from '../../common/generated_definitions';
import { ItemRO } from '../definitions/daemon';
import { getItemDisplayName, getItemType } from './itemUtils';

export const showDeleteConfirmationDialog = async (items: ItemRO | ItemRO[]): Promise<boolean> => {
  const itemsName = isArray(items) ? items.map((i) => getItemDisplayName(i)).join(', ') : getItemDisplayName(items);
  return await NiceModal.show<boolean>(ConfirmationDialog, {
    title: <FormattedMessage id={'delete'} />,
    text: <FormattedMessage id={'areYouSureYouWantToDelete'} values={{ name: itemsName }} />,
    continueText: <FormattedMessage id={'delete'} />,
    continueColor: 'error',
  });
};
export const showUpdateItemDialog = async (item: ItemRO): Promise<ItemRO | undefined> => {
  switch (getItemType(item)) {
    case 'folder':
      return await NiceModal.show<FolderRO | undefined>(UpdateFolderDialog, {
        item: item,
      });
    case 'application':
      return await NiceModal.show<ApplicationRO | undefined>(UpdateApplicationDialog, {
        item: item,
      });
    case 'instance':
      return await NiceModal.show<InstanceRO | undefined>(UpdateInstanceDialog, {
        item: item,
      });
    default:
      throw new Error(`Unknown item type`);
  }
};
