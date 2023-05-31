declare module '@mui/material/styles' {
  interface BreakpointOverrides {
    xxl: true;
  }
}

const breakpoints = {
  values: {
    xs: 0,
    sm: 600,
    md: 900,
    lg: 1200,
    xl: 1536,
    xxl: 1920,
  },
};

export default breakpoints;
