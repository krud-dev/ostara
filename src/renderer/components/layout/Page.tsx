import { forwardRef, ReactNode } from 'react';
import { Box, BoxProps } from '@mui/material';
import { COMPONENTS_SPACING } from 'renderer/constants/ui';

interface PageProps extends BoxProps {
  children: ReactNode;
}

const Page = forwardRef<HTMLDivElement, PageProps>(({ children, sx, ...other }, ref) => {
  return (
    <Box ref={ref} sx={{ width: '100%', p: COMPONENTS_SPACING, ...sx }} {...other}>
      {children}
    </Box>
  );
});
export default Page;
