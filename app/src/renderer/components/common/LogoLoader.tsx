import { motion } from 'framer-motion';
import { alpha, styled } from '@mui/material/styles';
import { Box, SxProps } from '@mui/material';
import Logo from './Logo';

const RootStyle = styled('div')(({ theme }) => ({
  width: 120,
  height: 120,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

type LogoLoaderProps = {
  sx?: SxProps;
};

export default function LogoLoader({ ...other }: LogoLoaderProps) {
  return (
    <RootStyle {...other}>
      <motion.div
        animate={{
          scale: [1, 0.9, 0.9, 1, 1],
          opacity: [0.84, 0.48, 0.48, 0.84, 0.84],
          rotateY: [0, 180, 180, 0, 0],
        }}
        transition={{
          duration: 2,
          ease: 'easeInOut',
          repeatDelay: 1,
          repeat: Infinity,
        }}
      >
        <Logo disabledLink size={48} />
      </motion.div>

      <Box
        component={motion.div}
        animate={{
          scale: [1.2, 1, 1, 1.2, 1.2],
          rotate: [270, 0, 0, 270, 270],
          opacity: [0.5, 1, 1, 1, 0.5],
          borderRadius: ['25%', '25%', '50%', '50%', '25%'],
        }}
        transition={{ ease: 'linear', duration: 3.2, repeat: Infinity }}
        sx={{
          width: 80,
          height: 80,
          borderRadius: '25%',
          position: 'absolute',
          border: (theme) => `solid 3px ${alpha(theme.palette.primary.dark, 0.48)}`,
        }}
      />

      <Box
        component={motion.div}
        animate={{
          scale: [1, 1.2, 1.2, 1, 1],
          rotate: [0, 270, 270, 0, 0],
          opacity: [1, 0.5, 0.5, 0.5, 1],
          borderRadius: ['25%', '25%', '50%', '50%', '25%'],
        }}
        transition={{
          ease: 'linear',
          duration: 3.2,
          repeat: Infinity,
        }}
        sx={{
          width: 100,
          height: 100,
          borderRadius: '25%',
          position: 'absolute',
          border: (theme) => `solid 8px ${alpha(theme.palette.primary.dark, 0.48)}`,
        }}
      />
    </RootStyle>
  );
}
