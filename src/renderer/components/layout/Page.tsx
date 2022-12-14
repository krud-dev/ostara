import { forwardRef, ReactNode } from 'react';
import { Box, BoxProps } from '@mui/material';

interface PageProps extends BoxProps {
  children: ReactNode;
}

const Page = forwardRef<HTMLDivElement, PageProps>(
  ({ children, ...other }, ref) => {
    return (
      <Box ref={ref} {...other}>
        {children}
      </Box>
    );
  }
);
export default Page;
