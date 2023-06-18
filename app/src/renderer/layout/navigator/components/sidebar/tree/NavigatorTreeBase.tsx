import { Tree, TreeApi } from 'react-arborist';
import React, { useCallback, useRef } from 'react';
import { Box } from '@mui/material';
import { TreeItem } from 'renderer/layout/navigator/components/sidebar/tree/tree';
import { NAVIGATOR_ITEM_HEIGHT } from 'renderer/constants/ui';
import { experimentalStyled as styled, Theme } from '@mui/material/styles';
import { getItemDisplayName } from 'renderer/utils/itemUtils';
import { isWindows } from 'renderer/utils/platformUtils';
import { TreeProps } from 'react-arborist/dist/types/tree-props';
import { SxProps } from '@mui/system';
import { NavigatorTreeProvider } from 'renderer/contexts/NavigatorTreeContext';

const TreeStyle = styled(Tree<TreeItem>)(({ theme }) => ({
  '& [role="treeitem"]': {
    outline: 'none',
  },
}));

type NavigatorTreeBaseProps = {
  treeRef?: React.ForwardedRef<TreeApi<TreeItem> | undefined>;
  sx?: SxProps<Theme>;
} & Omit<TreeProps<TreeItem>, 'idAccessor' | 'indent' | 'rowHeight' | 'searchMatch'>;

export default function NavigatorTreeBase({ data, children, treeRef, sx, ...props }: NavigatorTreeBaseProps) {
  const innerTreeRef = useRef<TreeApi<TreeItem> | null>(null);

  const refHandler = useCallback((tree?: TreeApi<TreeItem> | null): void => {
    if (!tree) {
      return;
    }
    innerTreeRef.current = tree;
    if (typeof treeRef === 'function') {
      treeRef(tree);
    } else if (treeRef) {
      treeRef.current = tree;
    }
  }, []);

  const keyDownHandler = useCallback((event: React.KeyboardEvent): void => {
    if ((isWindows && event.key === 'F2') || (!isWindows && event.key === 'Enter')) {
      const node = innerTreeRef.current?.focusedNode || innerTreeRef.current?.selectedNodes[0];
      node?.edit();
    }
  }, []);

  return (
    <NavigatorTreeProvider data={data}>
      <Box onKeyDown={keyDownHandler} tabIndex={0} sx={sx}>
        <TreeStyle
          ref={refHandler}
          idAccessor={'id'}
          data={data}
          indent={12}
          rowHeight={NAVIGATOR_ITEM_HEIGHT}
          searchMatch={(node, term) => getItemDisplayName(node.data).toLowerCase().includes(term.toLowerCase())}
          {...props}
        >
          {children}
        </TreeStyle>
      </Box>
    </NavigatorTreeProvider>
  );
}
