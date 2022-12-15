import { NodeRendererProps } from 'react-arborist';
import {
  IconButton,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  alpha,
  experimentalStyled as styled,
  useTheme,
} from '@mui/material/styles';
import React, { useCallback, useMemo } from 'react';
import { TreeItem } from 'renderer/layout/navigator/components/tree/tree';
import typography from 'renderer/theme/config/typography';
import {
  CloudOutlined,
  DnsOutlined,
  FolderOutlined,
  KeyboardArrowDown,
  KeyboardArrowRight,
  SvgIconComponent,
} from '@mui/icons-material';
import {
  isApplication,
  isFolder,
} from 'infra/configuration/model/configuration';
import { NAVIGATOR_ITEM_HEIGHT } from 'renderer/constants/ui';

// const ListItemStyle = styled(ListItem)(({ theme }) => ({
//   marginTop: theme.spacing(5),
//   // '& .apexcharts-legend': {
//   // },
// }));

type NavigatorTreeNodeProps = NodeRendererProps<TreeItem>;

// export default function NavigatorTreeNode({ node }: NavigatorTreeNodeProps) {
//   const Icon = node.data.icon || BsTree;
//   return (
//     <div
//       ref={dragHandle}
//       style={style}
//       className={clsx(styles.node, node.state)}
//       onClick={() => node.isInternal && node.toggle()}
//     >
//       <FolderArrow node={node} />
//       <span>
//         <Icon />
//       </span>
//       <span>{node.isEditing ? <Input node={node} /> : node.data.name}</span>
//       <span>{node.data.unread === 0 ? null : node.data.unread}</span>
//     </div>
//   );
// }
//
// function Input({ node }: { node: NodeApi<TreeItem> }) {
//   return (
//     <input
//       autoFocus
//       type="text"
//       defaultValue={node.data.name}
//       onFocus={(e) => e.currentTarget.select()}
//       onBlur={() => node.reset()}
//       onKeyDown={(e) => {
//         if (e.key === 'Escape') node.reset();
//         if (e.key === 'Enter') node.submit(e.currentTarget.value);
//       }}
//     />
//   );
// }
//
// function FolderArrow({ node }: { node: NodeApi<TreeItem> }) {
//   if (node.isLeaf) return <span></span>;
//   return (
//     <span>
//       {node.isOpen ? <icons.MdArrowDropDown /> : <icons.MdArrowRight />}
//     </span>
//   );
// }

const ListItemStyle = styled(ListItem<'div'>)(({ theme }) => ({
  ...typography.body2,
  height: NAVIGATOR_ITEM_HEIGHT,
  position: 'relative',
  textTransform: 'capitalize',
  color: theme.palette.text.secondary,
  '&:before': {
    top: 0,
    left: 0,
    width: 3,
    bottom: 0,
    content: "''",
    display: 'none',
    position: 'absolute',
    borderTopLeftRadius: 4,
    borderBottomLeftRadius: 4,
    backgroundColor: theme.palette.primary.main,
  },
}));

const ListItemIconStyle = styled(ListItemIcon)({
  width: 22,
  height: 22,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

export default function NavigatorTreeNode({
  style,
  node,
  tree,
  dragHandle,
  preview,
}: NavigatorTreeNodeProps) {
  const theme = useTheme();

  const isActiveRoot = node.isFocused;

  const ToggleIcon = useMemo<SvgIconComponent>(() => {
    return node.isOpen ? KeyboardArrowDown : KeyboardArrowRight;
  }, [node.isOpen]);

  const TypeIcon = useMemo<SvgIconComponent>(() => {
    if (isFolder(node.data)) {
      return FolderOutlined;
    }
    if (isApplication(node.data)) {
      return CloudOutlined;
    }
    return DnsOutlined;
  }, [node.data]);

  const activeRootStyle = {
    color: 'primary.main',
    // fontWeight: 'fontWeightMedium',
    bgcolor: alpha(
      theme.palette.primary.main,
      theme.palette.action.selectedOpacity
    ),
    '&:before': { display: 'block' },
  };

  const activeSubStyle = {
    color: 'text.primary',
    fontWeight: 'fontWeightMedium',
  };

  const onArrowClick = useCallback(
    (event: React.MouseEvent): void => {
      event.stopPropagation();
      node.toggle();
    },
    [node]
  );

  return (
    <ListItemStyle
      ref={dragHandle}
      component="div"
      disableGutters
      disablePadding
      sx={{
        ...(isActiveRoot && activeRootStyle),
      }}
      style={style}
    >
      {/*{!node.isLeaf && (*/}
      <IconButton
        onClick={onArrowClick}
        sx={{
          p: 0.5,
          mr: 0.5,
          ml: 1,
          ...(node.isLeaf ? { visibility: 'hidden' } : {}),
        }}
      >
        <ToggleIcon fontSize="small" />
      </IconButton>
      {/*)}*/}
      <ListItemIconStyle sx={{ mr: 1, ml: 0 }}>
        <TypeIcon fontSize="small" />
      </ListItemIconStyle>
      <ListItemText
        disableTypography
        primary={node.data.alias}
        sx={{
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
      />
      {/*{info && info}*/}
    </ListItemStyle>
  );
}
