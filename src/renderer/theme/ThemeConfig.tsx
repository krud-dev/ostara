import { ReactNode, useMemo } from 'react';
import { CssBaseline } from '@mui/material';
import { createTheme, ThemeOptions, ThemeProvider } from '@mui/material/styles';
import StyledEngineProvider from '@mui/material/StyledEngineProvider';
import shape from 'renderer/theme/config/shape';
import palette from 'renderer/theme/config/palette';
import typography from 'renderer/theme/config/typography';
import breakpoints from 'renderer/theme/config/breakpoints';
import componentsOverride from './overrides';
import shadows, { customShadows } from 'renderer/theme/config/shadows';
import { enUS, Localization } from '@mui/material/locale';
import RtlLayout from 'renderer/theme/RtlLayout';
import GlobalStyles from 'renderer/theme/GlobalStyles';

type ThemeConfigProps = {
  isDarkMode?: boolean;
  isRtl?: boolean;
  localization?: Localization;
  children: ReactNode;
};

export default function ThemeConfig({
  isDarkMode,
  isRtl,
  localization,
  children,
}: ThemeConfigProps) {
  const themeOptions: ThemeOptions = useMemo(
    () => ({
      palette: isDarkMode
        ? { ...palette.dark, mode: 'dark' }
        : { ...palette.light, mode: 'light' },
      shape,
      typography,
      breakpoints,
      direction: isRtl ? 'rtl' : 'ltr',
      shadows: isDarkMode ? shadows.dark : shadows.light,
      customShadows: isDarkMode ? customShadows.dark : customShadows.light,
    }),
    [isDarkMode, isRtl]
  );

  const theme = createTheme(themeOptions, localization || enUS);
  theme.components = componentsOverride(theme);

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <GlobalStyles />
        <RtlLayout>{children}</RtlLayout>
      </ThemeProvider>
    </StyledEngineProvider>
  );
}
