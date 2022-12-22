import { useCallback, useMemo, useState } from 'react';
import { Box, MenuItem, Stack } from '@mui/material';
import { NodeApi } from 'react-arborist';
import { TreeItem } from 'renderer/layout/navigator/components/sidebar/tree/tree';
import { useUpdateItem } from 'renderer/apis/configuration/item/updateItem';
import { experimentalStyled as styled, useTheme } from '@mui/material/styles';
import { amber, blue, green, indigo, orange, pink, purple, red, yellow } from '@mui/material/colors';
import { CheckOutlined } from '@mui/icons-material';

const MenuItemStyle = styled(MenuItem)(({ theme }) => ({
  cursor: 'default',
  '&:hover': {
    backgroundColor: 'transparent',
  },
}));

type ChooseColorMenuItemProps = {
  node: NodeApi<TreeItem>;
  onClose?: () => void;
};

export default function ChooseColorMenuItem({ node, onClose }: ChooseColorMenuItemProps) {
  const theme = useTheme();

  const [selectedColor, setSelectedColor] = useState<string | undefined>(node.data.color);

  const updateItemState = useUpdateItem();

  const updateColorHandler = useCallback(
    async (newColor: string | undefined): Promise<void> => {
      setSelectedColor(newColor);
      try {
        await updateItemState.mutateAsync({ item: { ...node.data, color: newColor } });
      } catch (e) {}
    },
    [onClose, node.data, updateItemState]
  );

  const defaultColor = useMemo<string>(() => theme.palette.text.secondary, []);

  const colors = useMemo<{ color: string; value: string | undefined }[]>(
    () => [
      { color: defaultColor, value: undefined },
      { color: red[500], value: red[500] },
      { color: pink[500], value: pink[500] },
      { color: purple[500], value: purple[500] },
      { color: indigo[500], value: indigo[500] },
      { color: blue[500], value: blue[500] },
      { color: green[500], value: green[500] },
      { color: yellow[500], value: yellow[500] },
      { color: amber[500], value: amber[500] },
      { color: orange[500], value: orange[500] },
    ],
    []
  );

  // material.red['500'], material.pink['500'], material.purple['500'], material.deepPurple['500'], material.indigo['500'], material.blue['500'], material.lightBlue['500'], material.cyan['500'], material.teal['500'], material.green['500'], material.lightGreen['500'], material.lime['500'], material.yellow['500'], material.amber['500'], material.orange['500'], material.deepOrange['500'], material.brown['500'], material.blueGrey['500']

  return (
    <MenuItemStyle disableRipple>
      <Stack direction="row" alignItems="center" spacing={0.5}>
        {colors.map((color) => {
          const selected = color.value === selectedColor;
          return (
            <ColorSwitch
              color={color.color}
              fillColor={color.value || 'transparent'}
              value={color.value}
              selected={selected}
              onClick={updateColorHandler}
              key={color.color}
            />
          );
        })}
      </Stack>
    </MenuItemStyle>
  );
}

type ColorSwitchProps = {
  color: string;
  fillColor?: string;
  value?: string;
  size?: number;
  selected?: boolean;
  onClick?: (value: string | undefined) => void;
};

function ColorSwitch({ color, fillColor, value, size = 18, selected, onClick }: ColorSwitchProps) {
  const backgroundColor = useMemo<string>(() => fillColor || color, [color, fillColor]);
  return (
    <Box
      onClick={() => onClick?.(value)}
      sx={{
        width: size,
        height: size,
        border: `1px solid ${color}`,
        backgroundColor: backgroundColor,
        borderRadius: '3px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
      }}
    >
      {selected && <CheckOutlined sx={{ color: 'text.primary', fontSize: '16px' }} />}
    </Box>
  );
}
