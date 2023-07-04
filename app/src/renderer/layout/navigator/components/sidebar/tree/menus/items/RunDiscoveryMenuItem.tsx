import { useCallback, useMemo } from 'react';
import { FormattedMessage } from 'react-intl';
import { NodeApi } from 'react-arborist';
import { TreeItem } from 'renderer/layout/navigator/components/sidebar/tree/tree';
import { isAgent } from 'renderer/utils/itemUtils';
import CustomMenuItem from 'renderer/components/menu/item/CustomMenuItem';
import { useRunDiscoveryForAgent } from 'renderer/apis/requests/agent/runDiscoveryForAgent';

type RunDiscoveryMenuItemProps = {
  node: NodeApi<TreeItem>;
  onClose?: () => void;
};

export default function RunDiscoveryMenuItem({ node, onClose }: RunDiscoveryMenuItemProps) {
  const disabled = useMemo<boolean>(() => false, [node.data]); // TODO: disable if agent is syncing

  const runDiscoveryState = useRunDiscoveryForAgent();

  const runDiscoveryHandler = useCallback(async (): Promise<void> => {
    onClose?.();

    if (!isAgent(node.data)) {
      return;
    }

    await runDiscoveryState.mutateAsync({ agentId: node.data.id });
  }, [onClose, node]);

  return (
    <CustomMenuItem
      icon={'SyncOutlined'}
      text={<FormattedMessage id={'syncAgent'} />}
      onClick={runDiscoveryHandler}
      disabled={disabled}
    />
  );
}
