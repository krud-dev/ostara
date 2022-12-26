import { useCallback, useMemo, useState } from 'react';
import { Box, MenuItem, Stack } from '@mui/material';
import { experimentalStyled as styled, useTheme } from '@mui/material/styles';
import { amber, blue, deepOrange, green, indigo, orange, pink, purple, red } from '@mui/material/colors';
import { CheckOutlined } from '@mui/icons-material';
import { useSetItemColor } from 'renderer/apis/configuration/item/setItemColor';
import { EnrichedItem } from 'infra/configuration/model/configuration';
import { DEFAULT_COLOR_VALUE } from 'renderer/hooks/useItemColor';

const MenuItemStyle = styled(MenuItem)(({ theme }) => ({
  cursor: 'default',
  '&:hover': {
    backgroundColor: 'transparent',
  },
}));

type ChooseColorMenuItemProps = {
  item: EnrichedItem;
  onClose?: () => void;
};

export default function ChooseColorMenuItem({ item, onClose }: ChooseColorMenuItemProps) {
  const theme = useTheme();

  const [selectedColor, setSelectedColor] = useState<string | undefined>(item.effectiveColor);

  const setItemColorState = useSetItemColor();

  const setColorHandler = useCallback(
    async (newColor: string | undefined): Promise<void> => {
      setSelectedColor(newColor);
      try {
        await setItemColorState.mutateAsync({ id: item.id, color: newColor });
      } catch (e) {}
    },
    [onClose, item, setItemColorState]
  );

  const noColor = useMemo<string>(() => theme.palette.text.primary, []);
  const defaultColor = useMemo<string>(() => theme.palette.text.secondary, []);

  const colors = useMemo<{ color: string; fillColor: string; value: string | undefined }[]>(
    () => [
      { color: noColor, fillColor: 'transparent', value: undefined },
      { color: defaultColor, fillColor: defaultColor, value: DEFAULT_COLOR_VALUE },
      { color: red[500], fillColor: red[500], value: red[500] },
      { color: pink[500], fillColor: pink[500], value: pink[500] },
      { color: purple[500], fillColor: purple[500], value: purple[500] },
      { color: indigo[500], fillColor: indigo[500], value: indigo[500] },
      { color: blue[500], fillColor: blue[500], value: blue[500] },
      { color: green[500], fillColor: green[500], value: green[500] },
      { color: amber[500], fillColor: amber[500], value: amber[500] },
      { color: orange[500], fillColor: orange[500], value: orange[500] },
      { color: deepOrange[500], fillColor: deepOrange[500], value: deepOrange[500] },
    ],
    []
  );

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
