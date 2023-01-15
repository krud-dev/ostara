import { Box, Link, Stack, Typography } from '@mui/material';
import { InstanceBean } from 'renderer/apis/instance/getInstanceBeans';
import { FormattedMessage } from 'react-intl';
import { COMPONENTS_SPACING } from 'renderer/constants/ui';

type InstanceBeanDetailsProps = {
  row: InstanceBean;
};

export default function InstanceBeanDetails({ row }: InstanceBeanDetailsProps) {
  return (
    <Stack direction={'column'} spacing={COMPONENTS_SPACING}>
      <Box>
        <Typography
          variant={'caption'}
          sx={{ color: 'text.secondary', fontWeight: 'bold', textTransform: 'uppercase' }}
        >
          <FormattedMessage id={'type'} />
        </Typography>
        <Typography variant={'body2'}>{row.type}</Typography>
      </Box>
      {!!row.dependencies?.length && (
        <Box>
          <Typography
            variant={'caption'}
            sx={{ color: 'text.secondary', fontWeight: 'bold', textTransform: 'uppercase' }}
          >
            <FormattedMessage id={'dependencies'} />
          </Typography>
          {row.dependencies.map((dependency) => (
            <Typography variant={'body2'} key={dependency}>
              <Link href={`#${dependency}`}>{dependency}</Link>
            </Typography>
          ))}
        </Box>
      )}
    </Stack>
  );
}
