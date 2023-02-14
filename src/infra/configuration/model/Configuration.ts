
export type ThemeSource = 'system' | 'light' | 'dark';

export type Configuration = {
  /**
   * Whether the app is in developer mode
   * This mode exposes additional data which is useful for debugging
   * @default false
   */
  developerMode: boolean;

  /**
   * Whether the app is in dark mode
   * @default false
   */
  darkMode: boolean;

  /**
   * Determines what theme to use, if system is selected, the app will use the system theme
   * @default 'system'
   */
  themeSource: ThemeSource;

  /**
   * The locale to use for the app
   * @default 'en-US'
   */
  locale: string;

  /**
   * The width of the sidebar
   * @default DEFAULT_ROWS_PER_PAGE
   */
  sidebarWidth: number;

  /**
   * How many rows to show per page in the table
   * @default SIDEBAR_DEFAULT_WIDTH
   */
  tableRowsPerPage: number;
};
