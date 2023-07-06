import { useCallback, useMemo } from 'react';
import { FormattedMessage } from 'react-intl';
import { NodeApi } from 'react-arborist';
import { TreeItem } from 'renderer/layout/navigator/components/sidebar/tree/tree';
import { isAgent, isEnrichedAgent } from 'renderer/utils/itemUtils';
import CustomMenuItem from 'renderer/components/menu/item/CustomMenuItem';
import { useRunDiscoveryForAgent } from 'renderer/apis/requests/agent/runDiscoveryForAgent';
import { useSnackbar } from 'notistack';

type RunDiscoveryMenuItemProps = {
  node: NodeApi<TreeItem>;
  onClose?: () => void;
};

export default function RunDiscoveryMenuItem({ node, onClose }: RunDiscoveryMenuItemProps) {
  const { enqueueSnackbar } = useSnackbar();

  const disabled = useMemo<boolean>(() => {
    if (!isEnrichedAgent(node.data)) {
      return true;
    }
    if (node.data.health.status !== 'HEALTHY') {
      return true;
    }
    if (node.data.syncing) {
      return true;
    }
    return false;
  }, [node.data]);

  const runDiscoveryState = useRunDiscoveryForAgent();

  const runDiscoveryHandler = useCallback(async (): Promise<void> => {
    onClose?.();

    if (!isAgent(node.data)) {
      return;
    }

    try {
      await runDiscoveryState.mutateAsync({ agentId: node.data.id });
      enqueueSnackbar(<FormattedMessage id={'syncAgentStarted'} />, { variant: 'info' });
    } catch (e) {
      enqueueSnackbar(<FormattedMessage id={'syncAgentFailed'} />, { variant: 'error' });
    }
  }, [onClose, node, runDiscoveryState, enqueueSnackbar]);

  return (
    <CustomMenuItem
      icon={'SyncOutlined'}
      text={<FormattedMessage id={'syncAgent'} />}
      onClick={runDiscoveryHandler}
      disabled={disabled}
    />
  );
}
