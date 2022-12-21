import NiceModal from '@ebay/nice-modal-react';
import ConfirmationDialog from 'renderer/components/dialog/ConfirmationDialog';
import { FormattedMessage } from 'react-intl';
import { Item } from 'infra/configuration/model/configuration';
import { isArray } from 'lodash';

export const showDeleteConfirmationDialog = async (items: Item | Item[]): Promise<boolean> => {
  const itemsName = isArray(items) ? items.map((i) => i.alias).join(', ') : items.alias;
  return await NiceModal.show<boolean>(ConfirmationDialog, {
    title: <FormattedMessage id={'delete'} />,
    text: <FormattedMessage id={'areYouSureYouWantToDelete'} values={{ name: itemsName }} />,
    continueText: <FormattedMessage id={'delete'} />,
    continueColor: 'error',
  });
};
