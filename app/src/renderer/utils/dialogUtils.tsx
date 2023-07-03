import NiceModal from '@ebay/nice-modal-react';
import ConfirmationDialog, { ConfirmationDialogProps } from 'renderer/components/dialog/ConfirmationDialog';
import { FormattedMessage } from 'react-intl';
import { isArray } from 'lodash';
import UpdateFolderDialog, {
  UpdateFolderDialogProps,
} from 'renderer/components/item/dialogs/update/UpdateFolderDialog';
import UpdateApplicationDialog, {
  UpdateApplicationDialogProps,
} from 'renderer/components/item/dialogs/update/UpdateApplicationDialog';
import UpdateInstanceDialog, {
  UpdateInstanceDialogProps,
} from 'renderer/components/item/dialogs/update/UpdateInstanceDialog';
import { AgentRO, ApplicationRO, FolderRO, InstanceRO } from 'common/generated_definitions';
import { ItemRO } from '../definitions/daemon';
import { getItemDisplayName, isAgent, isApplication, isFolder, isInstance } from './itemUtils';
import UpdateAgentDialog, { UpdateAgentDialogProps } from 'renderer/components/item/dialogs/update/UpdateAgentDialog';

export const showDeleteConfirmationDialog = async (name: string): Promise<boolean> => {
  return await NiceModal.show<boolean, ConfirmationDialogProps>(ConfirmationDialog, {
    title: <FormattedMessage id={'delete'} />,
    text: <FormattedMessage id={'areYouSureYouWantToDelete'} values={{ name }} />,
    continueText: <FormattedMessage id={'delete'} />,
    continueColor: 'error',
  });
};

export const showDeleteItemConfirmationDialog = async (items: ItemRO | ItemRO[]): Promise<boolean> => {
  const itemsName = isArray(items) ? items.map((i) => getItemDisplayName(i)).join(', ') : getItemDisplayName(items);
  return await showDeleteConfirmationDialog(itemsName);
};

export const showUpdateItemDialog = async (item: ItemRO): Promise<ItemRO | undefined> => {
  if (isFolder(item)) {
    return await NiceModal.show<FolderRO | undefined, UpdateFolderDialogProps>(UpdateFolderDialog, {
      item: item,
    });
  }
  if (isApplication(item)) {
    return await NiceModal.show<ApplicationRO | undefined, UpdateApplicationDialogProps>(UpdateApplicationDialog, {
      item: item,
    });
  }
  if (isInstance(item)) {
    return await NiceModal.show<InstanceRO | undefined, UpdateInstanceDialogProps>(UpdateInstanceDialog, {
      item: item,
    });
  }
  if (isAgent(item)) {
    return await NiceModal.show<AgentRO | undefined, UpdateAgentDialogProps>(UpdateAgentDialog, {
      item: item,
    });
  }
  throw new Error(`Unknown item type`);
};
