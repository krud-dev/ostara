import { useCallback, useMemo, useState } from 'react';
import { Box, MenuItem, Stack } from '@mui/material';
import { experimentalStyled as styled, useTheme } from '@mui/material/styles';
import { amber, blue, deepOrange, green, indigo, orange, pink, purple, red } from '@mui/material/colors';
import { CheckOutlined } from '@mui/icons-material';
import { DEFAULT_COLOR_VALUE, INHERITED_COLOR_VALUE } from 'renderer/hooks/useItemColor';
import { ItemRO } from '../../../../../../../definitions/daemon';
import { useUpdateItem } from '../../../../../../../apis/requests/item/updateItem';

const MenuItemStyle = styled(MenuItem)(({ theme }) => ({
  cursor: 'default',
  '&:hover': {
    backgroundColor: 'transparent',
  },
}));

type ChooseColorMenuItemProps = {
  item: ItemRO;
  onClose?: () => void;
};

export default function ChooseColorMenuItem({ item, onClose }: ChooseColorMenuItemProps) {
  const theme = useTheme();

  const [selectedColor, setSelectedColor] = useState<string | undefined>(item.effectiveColor);

  const updateItemState = useUpdateItem();

  const setColorHandler = useCallback(
    async (newColor: string): Promise<void> => {
      setSelectedColor(newColor);
      try {
        await updateItemState.mutateAsync({ item: { ...item, color: newColor } });
      } catch (e) {}
    },
    [onClose, item, updateItemState]
  );

  const noColor = useMemo<string>(() => theme.palette.text.primary, []);
  const defaultColor = useMemo<string>(() => theme.palette.text.secondary, []);

  const colors = useMemo<{ color: string; fillColor: string; value: string }[]>(() => {
    const colorsIndex = 400;
    return [
      { color: noColor, fillColor: 'transparent', value: INHERITED_COLOR_VALUE },
      { color: defaultColor, fillColor: defaultColor, value: DEFAULT_COLOR_VALUE },
      { color: red[colorsIndex], fillColor: red[colorsIndex], value: red[colorsIndex] },
      { color: pink[colorsIndex], fillColor: pink[colorsIndex], value: pink[colorsIndex] },
      { color: purple[colorsIndex], fillColor: purple[colorsIndex], value: purple[colorsIndex] },
      { color: indigo[colorsIndex], fillColor: indigo[colorsIndex], value: indigo[colorsIndex] },
      { color: blue[colorsIndex], fillColor: blue[colorsIndex], value: blue[colorsIndex] },
      { color: green[colorsIndex], fillColor: green[colorsIndex], value: green[colorsIndex] },
      { color: amber[colorsIndex], fillColor: amber[colorsIndex], value: amber[colorsIndex] },
      { color: orange[colorsIndex], fillColor: orange[colorsIndex], value: orange[colorsIndex] },
      { color: deepOrange[colorsIndex], fillColor: deepOrange[colorsIndex], value: deepOrange[colorsIndex] },
    ];
  }, []);

  return (
    <MenuItemStyle disableRipple>
      <Stack direction="row" alignItems="center" spacing={0.5}>
        {colors.map((color) => {
          const selected = color.value === selectedColor;
          return (
            <ColorSwitch
              color={color.color}
              fillColor={color.fillColor}
              value={color.value}
              selected={selected}
              onClick={setColorHandler}
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
  value: string;
  size?: number;
  selected?: boolean;
  onClick?: (value: string) => void;
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
